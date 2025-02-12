import { getByProps, getBySource } from "../../modules/webpack";
import { React } from "@common";
import "./badge.css";
import Badges from "./badges";
import { Clickable, Tooltip } from "@components";
import { goToOrJoinServer } from "../../util";

type Clickable = React.FC<
  Record<string, unknown> & {
    "aria-label"?: string;
    className?: string;
    children: React.ReactElement | React.ReactElement[];
    onClick?: () => void;
  }
>;

interface BadgeProps {
  color?: string;
  tooltip?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  className?: string;
  children: React.ReactElement;
  gap?: boolean;
  onClick?: () => void;
}

export const Base = ({
  color,
  tooltip,
  tooltipPosition,
  className,
  children,
  gap,
  onClick,
}: BadgeProps): React.ReactElement => {
  const badgeClassMod = getByProps<
    "profileBadge22",
    {
      profileBadge22: string;
    }
  >("profileBadge22");
  if (!badgeClassMod) {
    throw new Error("Failed to find badge class");
  }
  const { profileBadge22 } = badgeClassMod;

  const child = (
    <div
      className={`${profileBadge22} replugged-badge ${className || ""}`}
      style={{ color: `#${color || "7289da"}` }}>
      {children}
    </div>
  );
  return (
    <Clickable onClick={onClick}>
      {tooltip ? (
        <Tooltip
          text={tooltip}
          position={tooltipPosition || "top"}
          spacing={gap === false ? 0 : 12}>
          {child}
        </Tooltip>
      ) : (
        child
      )}
    </Clickable>
  );
};

export interface BadgeArgs {
  color?: string;
  url?: string;
  name?: string;
}

export interface APIBadges {
  developer?: boolean;
  staff?: boolean;
  support?: boolean;
  contributor?: boolean;
  translator?: boolean;
  hunter?: boolean;
  early?: boolean;
  booster?: boolean;
  custom?: {
    name: string;
    icon?: string;
    color?: string;
  };
}

export type BadgeComponent = (args: BadgeArgs) => React.ReactElement<{
  children: React.ReactElement[];
  className: string;
}>;

// todo: move to common modules
const openExternal = getBySource('.target="_blank";') as (url: string) => Promise<void>;
if (!openExternal) {
  throw new Error("Failed to find openExternal function");
}

// todo: make global (configurable?) variables for these
const openContributorsPage = () => openExternal("https://replugged.dev/contributors");
const openTranslationsPage = () => openExternal("https://i18n.replugged.dev");
const joinRepluggedServer = () => goToOrJoinServer("replugged");

const Custom = React.memo(({ url, name }: BadgeArgs) => (
  <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
));
const Booster = React.memo(({ color }: BadgeArgs) => (
  <Base
    children={<Badges.Booster />}
    tooltip={"Replugged Booster"}
    color={color}
    onClick={joinRepluggedServer}
  />
));
const BugHunter = React.memo(({ color }: BadgeArgs) => (
  <Base children={<Badges.BugHunter />} tooltip={"Replugged Bug Hunter"} color={color} />
));
const Contributor = React.memo(({ color }: BadgeArgs) => (
  <Base
    children={<Badges.Contributor />}
    tooltip={"Replugged Contributor"}
    color={color}
    onClick={openContributorsPage}
  />
));
const Developer = React.memo(({ color }: BadgeArgs) => (
  <Base
    children={<Badges.Developer />}
    tooltip={"Replugged Developer"}
    color={color}
    onClick={openContributorsPage}
  />
));
const EarlyUser = React.memo(({ color }: BadgeArgs) => (
  <Base children={<Badges.EarlyUser />} tooltip={"Replugged Early User"} color={color} />
));
const Staff = React.memo(({ color }: BadgeArgs) => (
  <Base
    children={<Badges.Staff />}
    tooltip={"Replugged Staff"}
    color={color}
    onClick={joinRepluggedServer}
  />
));
const Support = React.memo(({ color }: BadgeArgs) => (
  <Base
    children={<Badges.Support />}
    tooltip={"Replugged Support"}
    color={color}
    onClick={joinRepluggedServer}
  />
));
const Translator = React.memo(({ color }: BadgeArgs) => (
  <Base
    children={<Badges.Translator />}
    tooltip={"Replugged Translator"}
    color={color}
    onClick={openTranslationsPage}
  />
));

const badgeElements: Array<{
  type: keyof APIBadges;
  component: React.MemoExoticComponent<BadgeComponent>;
}> = [
  { type: "staff", component: Staff },
  { type: "support", component: Support },
  { type: "developer", component: Developer },
  { type: "contributor", component: Contributor },
  { type: "translator", component: Translator },
  { type: "hunter", component: BugHunter },
  { type: "booster", component: Booster },
  { type: "early", component: EarlyUser },
];

export { badgeElements, Custom };
