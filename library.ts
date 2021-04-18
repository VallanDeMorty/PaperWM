export const Meta = imports.gi.Meta;
export const St = imports.gi.St;
export const Gio = imports.gi.Gio;
export const Gdk = imports.gi.Gdk;
export const GLib = imports.gi.GLib;
export const GObject = imports.gi.GObject;
export const PanelMenu = imports.ui.panelMenu;
export const PopupMenu = imports.ui.popupMenu;
export const Clutter = imports.gi.Clutter;
export const GdkPixbuf = imports.gi.GdkPixbuf;
export const Cogl = imports.gi.Cogl;
export const Main = imports.ui.main;
export const Shell = imports.gi.Shell;
export const Mainloop = imports.mainloop;

export const PanelBox = Main.layoutManager.panelBox;

export let Extension: any;
if (imports.misc.extensionUtils.extensions) {
  Extension =
    imports.misc.extensionUtils.extensions["paperwm@hedning:matrix.org"];
} else {
  Extension = imports.ui.main.extensionManager.lookup(
    "paperwm@hedning:matrix.org"
  );
}

export const Window: any = window;

export const WorkspaceManager = global.workspace_manager;
export const Display = global.display;
export const Stage = global.stage;
export const Global = global;

export const Version = imports.misc.config.PACKAGE_VERSION.split(".").map(
  Number
);
