import * as Gjs from "./Gjs";
import * as GLib20 from "./GLib-2.0";
import * as GObject20 from "./GObject-2.0";
import * as Clutter7 from "./Clutter-7";
import * as Shell01 from "./Shell-0.1";
import * as Cairo10 from "./cairo-1.0";
import * as Json10 from "./Json-1.0";
import * as GL10 from "./GL-1.0";
import * as CoglPango7 from "./CoglPango-7";
import * as Cogl7 from "./Cogl-7";
import * as Atk10 from "./Atk-1.0";
import * as Gio20 from "./Gio-2.0";
import * as PangoCairo10 from "./PangoCairo-1.0";
import * as Pango10 from "./Pango-1.0";
import * as HarfBuzz00 from "./HarfBuzz-0.0";
import * as St10 from "./St-1.0";
import * as PolkitAgent10 from "./PolkitAgent-1.0";
import * as NM10 from "./NM-1.0";
import * as Meta7 from "./Meta-7";
import * as Gvc10 from "./Gvc-1.0";
import * as Gcr3 from "./Gcr-3";
import * as ClutterX117 from "./ClutterX11-7";
import * as Xlib20 from "./xlib-2.0";
import * as Xfixes40 from "./xfixes-4.0";
import * as Gtk30 from "./Gtk-3.0";
import * as Gdk30 from "./Gdk-3.0";
import * as GDesktopEnums30 from "./GDesktopEnums-3.0";
import * as Cally7 from "./Cally-7";
import * as Polkit10 from "./Polkit-1.0";
import * as Gck1 from "./Gck-1";
import * as GdkPixbuf20 from "./GdkPixbuf-2.0";
import * as Graphene10 from "./Graphene-1.0";
import * as GModule20 from "./GModule-2.0";


declare global {
    function print(...args: any[]): void;
    function printerr(...args: any[]): void
    function log(message?: string): void
    function logError(exception: any, message?: string): void
    const ARGV: string[]
    const imports: typeof Gjs & {
        [key: string]: any
        gi: {
                    GLib: typeof GLib20;
                    GObject: typeof GObject20;
                    Clutter: typeof Clutter7;
                    Shell: typeof Shell01;
                    cairo: typeof Cairo10;
                    Json: typeof Json10;
                    GL: typeof GL10;
                    CoglPango: typeof CoglPango7;
                    Cogl: typeof Cogl7;
                    Atk: typeof Atk10;
                    Gio: typeof Gio20;
                    PangoCairo: typeof PangoCairo10;
                    Pango: typeof Pango10;
                    HarfBuzz: typeof HarfBuzz00;
                    St: typeof St10;
                    PolkitAgent: typeof PolkitAgent10;
                    NM: typeof NM10;
                    Meta: typeof Meta7;
                    Gvc: typeof Gvc10;
                    Gcr: typeof Gcr3;
                    ClutterX11: typeof ClutterX117;
                    xlib: typeof Xlib20;
                    xfixes: typeof Xfixes40;
                    Gtk: typeof Gtk30;
                    Gdk: typeof Gdk30;
                    GDesktopEnums: typeof GDesktopEnums30;
                    Cally: typeof Cally7;
                    Polkit: typeof Polkit10;
                    Gck: typeof Gck1;
                    GdkPixbuf: typeof GdkPixbuf20;
                    Graphene: typeof Graphene10;
                    GModule: typeof GModule20;
                  }
        searchPath: string[];
    }
}

export { imports }
