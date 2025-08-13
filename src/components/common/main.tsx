import { browser } from "wxt/browser";

import Logo from "~/assets/icon.png";
import { cn } from "~/lib/utils";

interface MainProps {
  readonly className?: string;
  readonly filename: string;
}

export const Main = ({ className, filename }: MainProps) => {
  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <img src={Logo} alt="Logo" className="w-24 animate-pulse text-primary" />
      <p className="text-pretty text-center leading-tight">
        {browser.i18n.getMessage("extensionName")}
      </p>
      <p className="text-sm text-center text-muted-foreground max-w-md">
        {browser.i18n.getMessage("extensionDescription")}
      </p>
      <p className="text-xs text-center text-muted-foreground">
        Navigate to YouTube's Watch Later playlist to use this extension
      </p>
    </main>
  );
};
