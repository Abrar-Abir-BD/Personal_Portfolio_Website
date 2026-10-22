"""
restyle_character.py — turn the base portfolio character into YOUR character
=============================================================================
Works in Blender 4.2 or newer (tested on 5.2).

HOW TO USE
  1. Put your base model (character.glb) in a folder.
  2. Open Blender -> File > Save As -> save a .blend file in THAT SAME folder.
  3. Scripting tab -> Open -> choose this file -> press ▶ Run Script.
  4. A new file  character_me.glb  is saved in the same folder.
     Your original character.glb is not changed.

WHAT IT CHANGES (rig + all animations are kept as they are)
  * Skin, hoodie, pants, shoe and hair colours
  * Voluminous, swept-back wavy hair, short sideburns
  * Thick, square black glasses with rounded corners and silver studs
  * Curled mustache, jawline beard and a small patch under the lip
  * Drawstrings on the hoodie
  * Cargo pockets on the pants
  * Plain, rounded white sneakers
  * A small white robot buddy on the desk with a cable

Tweak the SETTINGS below and run again any time.
"""

import bpy
import bmesh
import math
import os
import random
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

# ─────────────────────────────── SETTINGS ────────────────────────────────
INPUT_GLB = "character.glb"
OUTPUT_GLB = "character_me.glb"
ADD_ROBOT = True
HOODIE_TEXT = ""        # your own word/name, e.g. "ATIK"  ("" = plain hoodie)
ROBOT_FORWARD = 1.2    # how far the robot sits toward the far edge of the desk

# Beard shape (degrees). Bigger SPREAD = wider along the jaw.
BEARD_SPREAD_DEG = 94
BEARD_TOP_CENTER_DEG = -36   # top edge under the lip
BEARD_TOP_SIDE_DEG = 16       # top edge near the ears
BEARD_CENTER_DROP = 0.1

COLORS = {
    "skin":        "#E2B08A",
    "beard":       "#3B2D27",
    "hair":        "#1D181A",
    "hoodie":      "#46464B",
    "hoodie_text": "#C8202A",
    "pants":       "#26388A",
    "shoe_white":  "#F3F3F3",
    "shoe_red":    "#C41E2A",
    "shoe_sole":   "#E4E4E6",
    "wood":        "#B07A4A",
    "table_legs":  "#141416",
    "shoe_black":  "#161616",
    "frame":       "#151515",
    "stud":        "#C9CCD2",
    "lens":        "#E4EAF0",
    "robot_white": "#EDEDF2",
    "robot_dark":  "#24262B",
    "robot_glow":  "#3AA0FF",
}
# ─────────────────────────────────────────────────────────────────────────

random.seed(11)
UP = Vector((0, 0, 1))


# ══════════════════════════ helpers ══════════════════════════
def hex_to_linear(h):
    h = h.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return out


def bsdf_of(m):
    return next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


MATS = {}


def mat(key, rough=0.6, metal=0.0, emit=0.0, alpha=1.0):
    if key in MATS:
        return MATS[key]
    m = bpy.data.materials.new("Me_" + key)
    try:
        m.use_nodes = True
    except Exception:
        pass
    b = bsdf_of(m)
    col = hex_to_linear(COLORS[key])
    b.inputs["Base Color"].default_value = (*col, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = (*col, 1)
        b.inputs["Emission Strength"].default_value = emit
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
        for attr, val in (("blend_method", "BLEND"),
                          ("surface_render_method", "BLENDED")):
            try:
                setattr(m, attr, val)
            except Exception:
                pass
    m.diffuse_color = (*col, alpha)
    MATS[key] = m
    return m


def M(loc=(0, 0, 0), rot=None, scale=(1, 1, 1)):
    R = rot.to_4x4() if rot is not None else Matrix.Identity(4)
    return Matrix.Translation(loc) @ R @ Matrix.Diagonal((*scale, 1))


def rot(axis, deg):
    return Matrix.Rotation(math.radians(deg), 3, axis)


def add_sphere(bm, loc, r, scale=(1, 1, 1), rot_m=None, segs=(16, 10)):
    bmesh.ops.create_uvsphere(bm, u_segments=segs[0], v_segments=segs[1],
                              radius=r, matrix=M(loc, rot_m, scale))


def add_box(bm, loc, size, rot_m=None, bevel=0.0):
    res = bmesh.ops.create_cube(bm, size=1.0, matrix=M(loc, rot_m, size))
    if bevel:
        edges = list({e for v in res["verts"] for e in v.link_edges})
        bmesh.ops.bevel(bm, geom=edges, offset=bevel, offset_type="OFFSET",
                        segments=3, profile=0.5, affect="EDGES",
                        clamp_overlap=True)


def add_cyl(bm, a, b, r1, r2=None, segs=16):
    a, b = Vector(a), Vector(b)
    d = b - a
    rm = UP.rotation_difference(d.normalized()).to_matrix()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs,
                          radius1=r1, radius2=r1 if r2 is None else r2,
                          depth=d.length, matrix=M((a + b) / 2, rm))


def add_torus(bm, loc, R, r, rot_m=None, scale=(1, 1, 1), seg=32, ring=10,
              arc=(0.0, 1.0), ellipse=None):
    """Torus (or part of one when arc != (0,1)), path in local XY.
    ellipse=(rx, ry) makes an oval path while keeping the tube perfectly round."""
    closed = arc == (0.0, 1.0)
    n = seg if closed else seg + 1
    mtx = M(loc, rot_m, scale)
    rx, ry = ellipse if ellipse else (R, R)
    rows = []
    for i in range(n):
        u = 2 * math.pi * (arc[0] + (arc[1] - arc[0]) * i / seg)
        c = Vector((rx * math.cos(u), ry * math.sin(u), 0))
        nrm = Vector((math.cos(u) / rx, math.sin(u) / ry, 0)).normalized()
        row = []
        for j in range(ring):
            v = 2 * math.pi * j / ring
            p = c + nrm * (r * math.cos(v)) + Vector((0, 0, r * math.sin(v)))
            row.append(bm.verts.new(mtx @ p))
        rows.append(row)
    for i in range(seg if closed else n - 1):
        a, b = rows[i], rows[(i + 1) % n]
        for j in range(ring):
            bm.faces.new((a[j], b[j], b[(j + 1) % ring], a[(j + 1) % ring]))
    if not closed:                       # cap the two ends
        bm.faces.new(rows[0][::-1])
        bm.faces.new(rows[-1])


NEW_OBJECTS = []


def build(name, fn, material, smooth=True):
    bm = bmesh.new()
    fn(bm)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(material)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
        try:
            me.set_sharp_from_angle(angle=math.radians(50))
        except Exception:
            pass
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    NEW_OBJECTS.append(ob)
    return ob


def world_verts(name):
    ob = bpy.data.objects[name]
    dg = bpy.context.evaluated_depsgraph_get()
    ev = ob.evaluated_get(dg)
    me = ev.to_mesh()
    out = [ob.matrix_world @ v.co for v in me.vertices]
    ev.to_mesh_clear()
    return out


def bbox(vs):
    return (Vector(map(min, *vs)), Vector(map(max, *vs)))


def parent_to_bone(ob, rig, bone):
    mw = ob.matrix_world.copy()
    ob.parent = rig
    ob.parent_type = "BONE"
    ob.parent_bone = bone
    bpy.context.view_layer.update()
    ob.matrix_world = mw


# ══════════════════════════ load base model ══════════════════════════
folder = (os.path.dirname(bpy.data.filepath) if bpy.data.filepath
          else os.path.expanduser("~"))
src = INPUT_GLB if os.path.isabs(INPUT_GLB) else os.path.join(folder, INPUT_GLB)
if not os.path.exists(src):
    raise FileNotFoundError(
        f"Can't find {src}. Save your .blend file in the same folder as "
        f"{INPUT_GLB} (File > Save As), then run the script again.")

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.import_scene.gltf(filepath=src)

rig = next(o for o in bpy.data.objects if o.type == "ARMATURE")
HEAD_BONE = "spine.006"
CHEST_BONE = "spine.003"
rig.data.pose_position = "REST"          # build everything on the rest pose
bpy.context.view_layer.update()

# ══════════════════════════ colours on existing parts ══════════════════════════
skin = mat("skin", 0.55)
face = bpy.data.objects["Plane.001"]          # face keeps its own material
fm = face.data.materials[0]
mix = next((n for n in fm.node_tree.nodes if n.type == "MIX"), None)
skin_rgba = (*hex_to_linear(COLORS["skin"]), 1)
if mix:
    for sock in mix.inputs:
        if sock.enabled and sock.name == "B" and sock.type == "RGBA":
            sock.default_value = skin_rgba
else:
    bsdf_of(fm).inputs["Base Color"].default_value = skin_rgba
bsdf_of(fm).inputs["Roughness"].default_value = 0.55

ASSIGN = {
    "Ear.001": skin, "Neck": skin, "Hand": skin,
    "Cube.002": mat("wood", 0.6),            # chair legs
    "Plane.003": mat("table_legs", 0.45, 0.5),  # table legs
    "BODY.SHIRT": mat("hoodie", 0.85),
    "Pant": mat("pants", 0.9),
    "Shoe": mat("shoe_white", 0.5),
    "Sole": mat("shoe_sole", 0.55),
}
for name, m in ASSIGN.items():
    ob = bpy.data.objects.get(name)
    if ob:
        ob.data.materials.clear()
        ob.data.materials.append(m)

hair_ob = bpy.data.objects["hair"]
hair_mat = mat("hair", 0.5)
hair_ob.data.materials.clear()
hair_ob.data.materials.append(hair_mat)

# ══════════════════════════ measure the head ══════════════════════════
face_v = world_verts("Plane.001")
f_min, f_max = bbox(face_v)
eye_min, eye_max = bbox(world_verts("EYEs.001"))
brow_min, brow_max = bbox(world_verts("Eyebrow"))
ear_min, ear_max = bbox(world_verts("Ear.001"))
hair_v = world_verts("hair")
h_min, h_max = bbox(hair_v)
HEAD_C = Vector((0, (f_min.y + f_max.y) / 2, (f_min.z + f_max.z) / 2 + 0.15))


def front_y(z, x=0.0, tol=0.08):
    """Front surface of the face at height z (and side offset x)."""
    ys = [v.y for v in face_v if abs(v.x - x) < tol and abs(v.z - z) < 0.06]
    return min(ys) if ys else f_min.y


# ══════════════════════════ hair ══════════════════════════
def hair_front(x, z, tol=0.18):
    ys = [v.y for v in hair_v if abs(v.x - x) < tol and abs(v.z - z) < tol]
    return min(ys) if ys else f_min.y


def head_tree():
    """Surface of the head (face + original hair shape) to lay hair onto."""
    dg = bpy.context.evaluated_depsgraph_get()
    tmp = bmesh.new()
    for ob in (face, hair_ob):
        ev = ob.evaluated_get(dg)
        me = ev.to_mesh()
        part = bmesh.new()
        part.from_mesh(me)
        ev.to_mesh_clear()
        part.transform(ob.matrix_world)
        me2 = bpy.data.meshes.new("tmp")
        part.to_mesh(me2)
        part.free()
        tmp.from_mesh(me2)
        bpy.data.meshes.remove(me2)
    tree = BVHTree.FromBMesh(tmp)
    tmp.free()
    return tree


HEAD_TREE = head_tree()


def dir_ae(az, el):
    """Direction from the head centre. az 0 = straight ahead, el 0 = level."""
    az, el = math.radians(az), math.radians(el)
    return Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el),
                   math.sin(el)))


def scalp(d):
    hit = HEAD_TREE.ray_cast(HEAD_C + d * 4.0, -d)[0]
    return hit if hit is not None else HEAD_C + d


def slerp(d0, d1, u):
    om = d0.angle(d1)
    if om < 1e-4:
        return d0.copy()
    return ((math.sin((1 - u) * om) * d0 + math.sin(u * om) * d1)
            / math.sin(om)).normalized()


def hair_strand(bm, d0, d1, width, thick, lift, lift_mid, front_puff=0.0,
                waves=1.5, amp=0.07, phase=0.0, n=40, ring=12):
    """One wavy, tapered clump of hair swept along the head from d0 to d1."""
    side = d0.cross(d1).normalized()
    pts, outs, ws, hs = [], [], [], []
    for i in range(n + 1):
        u = i / n
        d = slerp(d0, d1, u)
        d = (d + side * amp * math.sin(2 * math.pi * waves * u + phase)).normalized()
        bump = math.sin(math.pi * u) ** 0.7
        lf = lift + lift_mid * bump + front_puff * math.exp(-((u - 0.16) / 0.13) ** 2)
        pts.append(scalp(d) + d * lf)
        outs.append(d)
        taper = math.sin(math.pi * min(1.0, 0.08 + u * 0.92)) ** 0.55
        ws.append(width * (0.25 + 0.75 * taper))
        hs.append(thick * (0.25 + 0.75 * taper))
    rings = []
    for i, p in enumerate(pts):
        t = (pts[min(i + 1, n)] - pts[max(i - 1, 0)]).normalized()
        b = t.cross(outs[i]).normalized()
        nn = b.cross(t).normalized()
        ring_v = []
        for j in range(ring):
            v = 2 * math.pi * j / ring
            q = p + b * ws[i] * math.cos(v) + nn * hs[i] * (math.sin(v) + 0.35)
            ring_v.append(bm.verts.new(q))
        rings.append(ring_v)
    for i in range(n):
        for j in range(ring):
            a0, a1 = rings[i][j], rings[i][(j + 1) % ring]
            b0, b1 = rings[i + 1][j], rings[i + 1][(j + 1) % ring]
            bm.faces.new((a0, a1, b1, b0))
    bm.faces.new(rings[0][::-1])
    bm.faces.new(rings[-1])


def hairline_el(az):
    """Lowest elevation the hair reaches at each angle round the head."""
    a = abs(((az + 180) % 360) - 180)
    if a < 55:                                    # forehead
        return 47
    if a < 115:                                   # above the ears
        t = (a - 55) / 60
        return 47 + (30 - 47) * t
    t = min(1.0, (a - 115) / 45)                  # behind the ears to the nape
    return 30 + (-35 - 30) * t


def hair_cap(bm, lift=0.1, NA=72, NE=14):
    """Smooth hair volume that covers the scalp under the wavy clumps."""
    grid = []
    for i in range(NA):
        az = 360 * i / NA
        e0 = hairline_el(az) + 3
        row = []
        for j in range(NE + 1):
            el = e0 + (86 - e0) * j / NE
            d = dir_ae(az, el)
            row.append(bm.verts.new(scalp(d) + d * lift))
        grid.append(row)
    for i in range(NA):
        r0, r1 = grid[i], grid[(i + 1) % NA]
        for j in range(NE):
            bm.faces.new((r0[j], r1[j], r1[j + 1], r0[j + 1]))
    bm.faces.new([grid[i][NE] for i in range(NA)])


def hair_waves(bm):
    """Voluminous, swept-back wavy hair with layered clumps."""
    rnd = random.Random(5)
    # top: big clumps sweeping from the hairline back over the crown
    for a0 in range(-48, 49, 12):
        d0 = dir_ae(a0, 50 + rnd.uniform(-2, 2))
        d1 = dir_ae(180 - a0 * 0.6, -12)
        hair_strand(bm, d0, d1, width=0.3, thick=0.13, lift=0.04,
                    lift_mid=0.12, front_puff=0.12, waves=1.4,
                    amp=0.06, phase=rnd.uniform(0, 6.28))
    # second, offset top layer to fill the gaps
    for a0 in range(-42, 43, 12):
        d0 = dir_ae(a0, 56)
        d1 = dir_ae(180 - a0 * 0.5, 0)
        hair_strand(bm, d0, d1, width=0.28, thick=0.12, lift=0.0,
                    lift_mid=0.06, front_puff=0.06, waves=1.6,
                    amp=0.05, phase=rnd.uniform(0, 6.28))
    # sides: layered waves sweeping back above the ears
    for s in (-1, 1):
        for e0, e1, lf in ((58, 22, 0.05), (44, 8, 0.03), (33, -10, 0.02)):
            d0 = dir_ae(s * 52, e0)
            d1 = dir_ae(s * 168, e1)
            hair_strand(bm, d0, d1, width=0.27, thick=0.12, lift=lf,
                        lift_mid=0.05, front_puff=0.04, waves=1.3,
                        amp=0.08, phase=rnd.uniform(0, 6.28))
    # back of the head: clumps falling down to the nape
    for a0 in range(130, 231, 17):
        d0 = dir_ae(a0, 55)
        d1 = dir_ae(a0 + rnd.uniform(-6, 6), -32)
        hair_strand(bm, d0, d1, width=0.27, thick=0.12, lift=0.02,
                    lift_mid=0.05, waves=1.2, amp=0.06,
                    phase=rnd.uniform(0, 6.28))
    # short sideburns in front of the ears
    for s in (-1, 1):
        add_sphere(bm, (s * ear_max.x * 0.66, ear_min.y - 0.05,
                        ear_min.z + 0.3), 0.12, (0.5, 0.9, 1.7))


hair_extra = build("Hair_Waves", hair_waves, hair_mat)

# ══════════════════════════ facial hair ══════════════════════════
nose_z = max((v.z for v in face_v if abs(v.x) < 0.08 and
              v.y < f_min.y + 0.03), default=13.0)
must_z = nose_z - 0.32
beard_mat = mat("beard", 0.9)


def facial_hair(bm):
    # curled mustache, two halves
    for s in (-1, 1):
        y = front_y(must_z, s * 0.15, 0.1)
        add_sphere(bm, (s * 0.16, y - 0.015, must_z), 1, (0.2, 0.06, 0.05),
                   rot_m=rot("Y", s * 14))
        add_sphere(bm, (s * 0.34, front_y(must_z - 0.05, s * 0.34, 0.1) + 0.01,
                        must_z - 0.06), 1, (0.08, 0.05, 0.04),
                   rot_m=rot("Y", s * 35))
    # small patch under the lower lip
    zp = must_z - 0.36
    add_sphere(bm, (0, front_y(zp) + 0.006, zp), 1, (0.075, 0.018, 0.055))


build("Facial_Hair", facial_hair, hair_mat)


def face_bvh():
    dg = bpy.context.evaluated_depsgraph_get()
    ev = face.evaluated_get(dg)
    me = ev.to_mesh()
    tmp = bmesh.new()
    tmp.from_mesh(me)
    ev.to_mesh_clear()
    tmp.transform(face.matrix_world)
    tree = BVHTree.FromBMesh(tmp)
    tmp.free()
    return tree


def beard(bm):
    """Short beard spread over the chin and along the jaw, with clean
    smooth edges (built by projecting a grid onto the face)."""
    tree = face_bvh()
    c = Vector((0, HEAD_C.y, must_z - BEARD_CENTER_DROP))
    A = math.radians(BEARD_SPREAD_DEG)
    NA, NE = 40, 22
    e_bot = math.radians(-72)

    def e_top(az):
        t = abs(az) / A
        return math.radians(BEARD_TOP_CENTER_DEG + (BEARD_TOP_SIDE_DEG -
                                                     BEARD_TOP_CENTER_DEG) * t ** 2.2)

    grid_out, grid_in = [], []
    for i in range(NA + 1):
        az = -A + 2 * A * i / NA
        row_o, row_i = [], []
        for j in range(NE + 1):
            el = e_bot + (e_top(az) - e_bot) * j / NE
            d = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el),
                        math.sin(el)))
            hit = tree.ray_cast(c + d * 4.0, -d)[0]
            if hit is None:
                hit = c + d * 1.0
            # thinner toward the edges so it blends into the skin
            edge = min(i, NA - i, NE - j) / 4.0
            th = 0.004 + 0.01 * min(1.0, edge)
            row_o.append(bm.verts.new(hit + d * th))
            row_i.append(bm.verts.new(hit - d * 0.01))
        grid_out.append(row_o)
        grid_in.append(row_i)
    for i in range(NA):
        for j in range(NE):
            bm.faces.new((grid_out[i][j], grid_out[i + 1][j],
                          grid_out[i + 1][j + 1], grid_out[i][j + 1]))
            bm.faces.new((grid_in[i][j + 1], grid_in[i + 1][j + 1],
                          grid_in[i + 1][j], grid_in[i][j]))
    # close the rim
    rim = ([(i, 0) for i in range(NA)] + [(NA, j) for j in range(NE)] +
           [(i, NE) for i in range(NA, 0, -1)] + [(0, j) for j in range(NE, 0, -1)])
    for k in range(len(rim)):
        (i0, j0), (i1, j1) = rim[k], rim[(k + 1) % len(rim)]
        try:
            bm.faces.new((grid_out[i0][j0], grid_in[i0][j0],
                          grid_in[i1][j1], grid_out[i1][j1]))
        except ValueError:
            pass
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])


build("Beard", beard, beard_mat)


# ══════════════════════════ glasses ══════════════════════════
# Square, thick black frames with rounded corners and small silver studs
EYE_Z = (eye_min.z + eye_max.z) / 2 - 0.07
LENS_Y = min(front_y(EYE_Z + 0.1), eye_min.y) - 0.13
EYE_X = 0.48                              # lens centre distance from middle
HW, HH = 0.36, 0.3                        # lens half width / half height
RIM = 0.075                               # frame thickness (front view)
DEPTH = 0.07                              # frame thickness (front to back)


def lens_contour(cx, n=64, grow=0.0):
    """Rounded-square outline (superellipse), a little wider at the top."""
    pts = []
    for k in range(n):
        t = 2 * math.pi * k / n
        ct, st = math.cos(t), math.sin(t)
        x = (HW + grow) * math.copysign(abs(ct) ** 0.5, ct)
        z = (HH + grow) * math.copysign(abs(st) ** 0.5, st)
        x *= 1 + 0.06 * (z / (HH + grow))
        pts.append(Vector((cx + x, 0, EYE_Z + z)))
    return pts


def wrap(p, s):
    """Tilt each side slightly so the frame follows the face."""
    cx = s * EYE_X
    ang = math.radians(7) * s
    dx = p.x - cx
    return Vector((cx + dx * math.cos(ang), LENS_Y + p.y + dx * math.sin(ang),
                   p.z))


def glasses_frame(bm):
    for s in (-1, 1):
        cx = s * EYE_X
        inner = lens_contour(cx)
        outer = lens_contour(cx, grow=RIM)
        rings = []
        for pts, dy in ((outer, -DEPTH / 2), (inner, -DEPTH / 2),
                        (inner, DEPTH / 2), (outer, DEPTH / 2)):
            rings.append([bm.verts.new(wrap(p + Vector((0, dy, 0)), s))
                          for p in pts])
        n = len(inner)
        new_faces = []
        for r in range(4):
            a_r, b_r = rings[r], rings[(r + 1) % 4]
            for k in range(n):
                new_faces.append(bm.faces.new((a_r[k], a_r[(k + 1) % n],
                                               b_r[(k + 1) % n], b_r[k])))
        bmesh.ops.recalc_face_normals(bm, faces=new_faces)
        loop_edges = [e for e in {e for f in new_faces for e in f.edges}
                      if len(e.link_faces) == 2 and
                      e.link_faces[0].normal.angle(e.link_faces[1].normal, 0) > 0.8]
        bmesh.ops.bevel(bm, geom=loop_edges, offset=0.018, offset_type="OFFSET",
                        segments=3, profile=0.5, affect="EDGES",
                        clamp_overlap=True)
        # hinge block + flat, thick temple arm back to the ear
        hx = s * (EYE_X + HW + RIM * 0.6)
        hz = EYE_Z + HH * 0.55
        hinge = wrap(Vector((hx, 0.02, hz)), s)
        add_box(bm, hinge + Vector((s * 0.02, 0.06, 0)), (0.09, 0.14, 0.1),
                bevel=0.02)
        tip = Vector((s * (ear_max.x - 0.48), ear_min.y + 0.1, EYE_Z + 0.1))
        start = hinge + Vector((s * 0.03, 0.12, 0))
        d = tip - start
        rm = Vector((0, 1, 0)).rotation_difference(d.normalized()).to_matrix()
        add_box(bm, (start + tip) / 2, (0.05, d.length, 0.085), rot_m=rm,
                bevel=0.02)
    # thick bridge
    bz = EYE_Z + HH * 0.45
    gap_l = wrap(Vector((-(EYE_X - HW - RIM) - 0.01, 0, bz)), -1)
    gap_r = wrap(Vector(((EYE_X - HW - RIM) + 0.01, 0, bz)), 1)
    add_box(bm, (gap_l + gap_r) / 2, ((gap_r.x - gap_l.x) + 0.06, DEPTH, 0.085),
            bevel=0.025)


def glasses_studs(bm):
    for s in (-1, 1):
        p = wrap(Vector((s * (EYE_X + HW + RIM * 0.35), -DEPTH / 2 - 0.006,
                         EYE_Z + HH * 0.62)), s)
        add_box(bm, p, (0.075, 0.012, 0.02), bevel=0.005)


def glasses_lens(bm):
    for s in (-1, 1):
        pts = [wrap(p, s) for p in lens_contour(s * EYE_X, n=48, grow=0.005)]
        vs = [bm.verts.new(p) for p in pts]
        bm.faces.new(vs)


build("Glasses_Frame", glasses_frame, mat("frame", 0.4))
build("Glasses_Studs", glasses_studs, mat("stud", 0.25, 0.9))
build("Glasses_Lens", glasses_lens, mat("lens", 0.05, alpha=0.1), smooth=False)

for n in ("Hair_Waves", "Facial_Hair", "Beard", "Glasses_Frame",
          "Glasses_Studs", "Glasses_Lens"):
    parent_to_bone(bpy.data.objects[n], rig, HEAD_BONE)

# ══════════════════════════ hoodie ══════════════════════════
shirt_v = world_verts("BODY.SHIRT")
neck_min, neck_max = bbox(world_verts("Neck"))
s_max_z = max(v.z for v in shirt_v)


def chest_y(z):
    ys = [v.y for v in shirt_v if abs(v.x) < 0.3 and abs(v.z - z) < 0.12]
    return min(ys) if ys else -0.5


def hoodie(bm):
    nz = s_max_z - 0.15
    ny = (neck_min.y + neck_max.y) / 2 + 0.12
    for s in (-1, 1):
        a = Vector((s * 0.22, chest_y(nz - 0.35) - 0.04, nz - 0.3))
        b = Vector((s * 0.26, chest_y(nz - 1.55) - 0.05, nz - 1.55))
        add_cyl(bm, a, b, 0.035, segs=8)
        add_cyl(bm, b, b - Vector((0, 0.01, 0.16)), 0.05, 0.045, segs=8)


build("Hoodie_Strings", hoodie, MATS["hoodie"])
parent_to_bone(bpy.data.objects["Hoodie_Strings"], rig, CHEST_BONE)

if HOODIE_TEXT.strip():
    td = bpy.data.curves.new("HoodieTextCurve", "FONT")
    td.body = HOODIE_TEXT.strip()
    td.align_x = "CENTER"
    td.size = 0.45
    td.extrude = 0.015
    tob = bpy.data.objects.new("TxtTmp", td)
    bpy.context.scene.collection.objects.link(tob)
    tz = s_max_z - 1.7
    tob.location = (0, chest_y(tz) - 0.03, tz)
    tob.rotation_euler = (math.radians(90), 0, 0)
    bpy.context.view_layer.update()
    tme = bpy.data.meshes.new_from_object(
        tob.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    tme.materials.clear()
    tme.materials.append(mat("hoodie_text", 0.7))
    txt = bpy.data.objects.new("Hoodie_Text", tme)
    bpy.context.scene.collection.objects.link(txt)
    txt.matrix_world = tob.matrix_world.copy()
    bpy.data.objects.remove(tob)
    parent_to_bone(txt, rig, CHEST_BONE)

# ══════════════════════════ pants: cargo pockets ══════════════════════════
pant_v = world_verts("Pant")
for side, s in (("L", 1), ("R", -1)):
    thigh = rig.data.bones[f"thigh.{side}"]
    th_top = (rig.matrix_world @ thigh.head_local).z
    th_bot = (rig.matrix_world @ thigh.tail_local).z
    pz = th_bot + (th_top - th_bot) * 0.42
    outer = max(v.x * s for v in pant_v if abs(v.z - pz) < 0.15)
    py = sum(v.y for v in pant_v if abs(v.z - pz) < 0.15 and v.x * s > outer
             - 0.1) / max(1, len([v for v in pant_v if abs(v.z - pz) < 0.15
                                  and v.x * s > outer - 0.1]))

    def pocket(bm, s=s, outer=outer, py=py, pz=pz):
        add_box(bm, (s * (outer + 0.05), py, pz), (0.12, 0.85, 1.0), bevel=0.04)
        add_box(bm, (s * (outer + 0.1), py, pz + 0.48), (0.09, 0.92, 0.22),
                bevel=0.04)
        add_sphere(bm, (s * (outer + 0.15), py, pz + 0.45), 0.05,
                   (0.5, 1, 1), segs=(10, 6))

    ob = build(f"Cargo_Pocket_{side}", pocket, MATS["pants"])
    parent_to_bone(ob, rig, f"thigh.{side}")

# ══════════════════════════ sneakers ══════════════════════════
shoe_v = world_verts("Shoe")
for side, s in (("L", 1), ("R", -1)):
    sv = [v for v in shoe_v if v.x * s > 0]
    mn, mx = bbox(sv)
    cx = (mn.x + mx.x) / 2
    half_w = (mx.x - mn.x) / 2

    def round_shoe(bm, mn=mn, mx=mx, cx=cx, half_w=half_w):
        ln = mx.y - mn.y
        # one smooth, rounded shell over the whole shoe
        cy = (mn.y + mx.y) / 2 - 0.04
        add_sphere(bm, (cx, cy, mn.z + 0.5), 1,
                   (half_w + 0.08, ln / 2 + 0.08, 0.62), segs=(40, 20))
        # chunky rounded midsole hiding the old shoe's lower edge
        add_sphere(bm, (cx, cy, mn.z + 0.14), 1,
                   (half_w + 0.12, ln / 2 + 0.12, 0.16), segs=(40, 12))

    ob = build(f"Shoe_Round_{side}", round_shoe, MATS["shoe_white"])
    parent_to_bone(ob, rig, f"foot.{side}")

# ══════════════════════════ robot buddy on the desk ══════════════════════════
if ADD_ROBOT and "Plane.002" in bpy.data.objects:
    d_min, d_max = bbox(world_verts("Plane.002"))
    kb_max = bbox(world_verts("Keyboard"))[1] if "Keyboard" in bpy.data.objects \
        else Vector((2.4, 0, 0))
    S = 9.0                                       # robot scale
    RB = Vector((min(d_max.x - 0.9, kb_max.x + 1.5),
                 (d_min.y + d_max.y) / 2 - 0.3 - ROBOT_FORWARD, d_max.z))

    def P(x, y, z):
        return RB + Vector((x, y, z)) * S

    def robot_white(bm):
        for sx in (-1, 1):
            add_box(bm, P(sx * 0.03, -0.01, 0.012), (0.035 * S, 0.06 * S,
                    0.024 * S), bevel=0.05)
            add_cyl(bm, P(sx * 0.03, 0, 0.02), P(sx * 0.03, 0, 0.13),
                    0.018 * S, 0.02 * S)
            add_cyl(bm, P(sx * 0.072, 0, 0.225), P(sx * 0.08, -0.005, 0.13),
                    0.014 * S)
            add_sphere(bm, P(sx * 0.072, 0, 0.228), 0.02 * S)
        add_box(bm, P(0, 0, 0.19), (0.11 * S, 0.07 * S, 0.12 * S), bevel=0.12)
        add_sphere(bm, P(0, 0, 0.30), 0.06 * S, (1.05, 0.95, 0.9),
                   segs=(24, 14))

    def robot_dark(bm):
        for sx in (-1, 1):
            add_sphere(bm, P(sx * 0.03, 0, 0.075), 0.021 * S)
            add_sphere(bm, P(sx * 0.08, -0.005, 0.125), 0.016 * S)
            add_cyl(bm, P(sx * 0.06, 0, 0.30), P(sx * 0.068, 0, 0.30),
                    0.022 * S)
        add_box(bm, P(0, 0, 0.135), (0.10 * S, 0.06 * S, 0.02 * S))
        add_cyl(bm, P(0, 0, 0.245), P(0, 0, 0.26), 0.02 * S)

    build("Robot_Body", robot_white, mat("robot_white", 0.35))
    build("Robot_Joints", robot_dark, mat("robot_dark", 0.4))
    build("Robot_Eyes", lambda bm: [add_sphere(
        bm, P(sx * 0.017, -0.054, 0.302), 0.009 * S, (0.8, 0.4, 1.4),
        segs=(12, 8)) for sx in (-1, 1)], mat("robot_glow", 0.2, emit=4.0))

    # cable from the keyboard to the robot's back
    cd = bpy.data.curves.new("CableCurve", "CURVE")
    cd.dimensions = "3D"
    cd.bevel_depth = 0.035
    cd.bevel_resolution = 3
    sp = cd.splines.new("BEZIER")
    sp.bezier_points.add(2)
    start = Vector((kb_max.x - 0.05, (d_min.y + d_max.y) / 2 + 0.6,
                    d_max.z + 0.08))
    pts = [start, Vector(((start.x + RB.x) / 2, RB.y + 0.6, d_max.z + 0.03)),
           P(0, 0.04, 0.17)]
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    cobj = bpy.data.objects.new("CableTmp", cd)
    bpy.context.scene.collection.objects.link(cobj)
    bpy.context.view_layer.update()
    cme = bpy.data.meshes.new_from_object(
        cobj.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(cobj)
    cme.materials.clear()
    cme.materials.append(MATS["robot_dark"])
    bpy.context.scene.collection.objects.link(bpy.data.objects.new("Cable", cme))

# ══════════════════════════ back to animated pose + export ══════════════════════════
rig.data.pose_position = "POSE"
bpy.context.view_layer.update()

out = OUTPUT_GLB if os.path.isabs(OUTPUT_GLB) else os.path.join(folder,
                                                                OUTPUT_GLB)
kw = dict(filepath=out, export_format="GLB", export_yup=True,
          export_apply=False, export_animations=True,
          export_cameras=False, export_lights=False)
try:
    bpy.ops.export_scene.gltf(**kw, export_animation_mode="ACTIONS",
                              export_morph=True, export_morph_animation=True)
except TypeError:
    bpy.ops.export_scene.gltf(**kw)
print(f"\n✅ Saved your character to: {out}\n")
