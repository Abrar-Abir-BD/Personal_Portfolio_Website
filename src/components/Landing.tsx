import { CSSProperties, Fragment, PropsWithChildren } from "react";
import "./styles/Landing.css";
import { landing } from "../data/portfolioContent";

// Roles longer than "Developer" break onto two lines at the space that
// balances them best, so the text keeps its full size and still fits
const toLines = (role: string) => {
  const words = role.split(" ");
  if (role.length <= 9 || words.length < 2) return [role];
  let best = 1;
  for (let i = 1; i < words.length; i++) {
    const diff = (k: number) =>
      Math.abs(
        words.slice(0, k).join(" ").length - words.slice(k).join(" ").length
      );
    if (diff(i) < diff(best)) best = i;
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};
// Non-breaking spaces: the letter-by-letter animation drops plain ones
const roles = landing.roles.map((role) =>
  toLines(role).map((line) => line.replace(/ /g, "\u00a0"))
);
const nextRoles = [...roles.slice(1), ...roles.slice(0, 1)];
const widestLine = roles
  .flat()
  .reduce((a, line) => (line.length > a.length ? line : a), "");
const roleStyle = {
  "--role-lines": Math.max(...roles.map((lines) => lines.length)),
} as CSSProperties;

const renderLines = (lines: string[]) =>
  lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>{landing.greeting}</h2>
            <h1>
              {landing.firstName} <span>{landing.lastName}</span>
            </h1>
          </div>
          <div className="landing-info" style={roleStyle}>
            <h3>{landing.intro}</h3>
            {/* Faded layer behind previews the next role, so it starts one ahead */}
            <h2 className="landing-info-h2">
              <div className="landing-role-sizer" aria-hidden="true">
                {widestLine}
              </div>
              {nextRoles.map((lines, i) => (
                <div className="landing-role landing-role-back" key={i}>
                  {renderLines(lines)}
                </div>
              ))}
            </h2>
            <h2>
              <div className="landing-role-sizer" aria-hidden="true">
                {widestLine}
              </div>
              {roles.map((lines, i) => (
                <div className="landing-role landing-role-front" key={i}>
                  {renderLines(lines)}
                </div>
              ))}
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
