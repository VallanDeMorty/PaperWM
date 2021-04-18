import {
  Extension,
  Gdk,
  GLib,
  Clutter,
  Meta,
  GObject,
  WorkspaceManager,
  Display,
  Window,
  GdkPixbuf,
  Cogl,
} from "./library";
import { Actor, AnimationMode } from "./@types/Gjs/Clutter-1.0";

// TODO: Remove
let registerClass;
{
  if (version[0] >= 3 && version[1] > 30) {
    registerClass = GObject.registerClass;
  } else {
    registerClass = (x: any, y: any) => (y ? y : x);
  }
}
export const RegisterClass = registerClass;

const debug_all = false; // Turn off by default
const debug_filter = { "#paperwm": true, "#stacktrace": true };
export function debug() {
  let keyword = arguments[0];
  let filter = debug_filter[keyword];
  if (filter === false) return;
  if (debug_all || filter === true)
    print(Array.prototype.join.call(arguments, " | "));
}

export function warn(...args: any[]) {
  print("WARNING:", ...args);
}

export function assert(condition: any, message: string, ...dump: any[]) {
  if (!condition) {
    throw new Error(message + "\n", dump);
  }
}

export function withTimer(message: any, fn: () => any) {
  let start = GLib.get_monotonic_time();
  let ret = fn();
  let stop = GLib.get_monotonic_time();
  log(`${message} ${((stop - start) / 1000).toFixed(1)}ms`);
}

export function print_stacktrace(error: any) {
  let trace;
  if (!error) {
    trace = new Error().stack?.split("\n");
    // Remove _this_ frame
    trace?.splice(0, 1);
  } else {
    trace = error.stack.split("\n");
  }
  // Remove some uninteresting frames
  let filtered = trace.filter((frame: string) => {
    return frame !== "wrapper@resource:///org/gnome/gjs/modules/lang.js:178";
  });
  log(`JS ERROR: ${error}\n ${trace.join("\n")}`);
}

export function framestr(rect: {
  x: string;
  y: string;
  width: string;
  height: string;
}) {
  return (
    "[ x:" +
    rect.x +
    ", y:" +
    rect.y +
    " w:" +
    rect.width +
    " h:" +
    rect.height +
    " ]"
  );
}

/**
 * TODO: Move into a different module
 *
 * Returns a human-readable enum value representation
 */
export function ppEnumValue(
  value: unknown,
  genum: { [s: string]: unknown } | ArrayLike<unknown>
) {
  let entry = Object.entries(genum).find(([k, v]) => v === value);
  if (entry) {
    return `${entry[0]} (${entry[1]})`;
  } else {
    return `<not-found> (${value})`;
  }
}

/**
 * TODO: Find out the references to make a decision to remove
 *
 * Look up the function by name at call time. This makes it convenient to
 * redefine the function without re-registering all signal handler, keybindings,
 * etc. (this is like a function symbol in lisp)
 */
export function dynamic_function_ref(
  handler_name: string | number,
  owner_obj: { [x: string]: { apply: (arg0: any, arg1: IArguments) => void } }
) {
  owner_obj = owner_obj || Window;

  return function () {
    owner_obj[handler_name].apply(this, arguments);
  };
}

/**
   Find the first x in `values` that's larger than `cur`.
   Cycle to first value if no larger value is found.
   `values` should be sorted in ascending order.
 */
export function findNext(cur: number, values: any[], slack = 0) {
  for (let i = 0; i < values.length; i++) {
    let x = values[i];
    if (cur < x) {
      if (x - cur < slack) {
        // Consider `cur` practically equal to `x`
        continue;
      } else {
        return x;
      }
    }
  }
  return values[0]; // cycle
}

export function swap(array: any[], i: number, j: number) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

export function in_bounds(array: any, i: number) {
  return i >= 0 && i < array.length;
}

export function isPointInsideActor(actor: Actor, x: number, y: number) {
  return (
    actor.x <= x &&
    x <= actor.x + actor.width &&
    actor.y <= y &&
    y <= actor.y + actor.height
  );
}

/**
 * TODO: Remove extra functionality
 *       Or move in the different package
 * resource://{resource_path}
 * @param actor
 * @param resource_path
 */
export function setBackgroundImage(actor: Actor, resource_path: string) {
  let image = new Clutter.Image();

  let pixbuf = GdkPixbuf.Pixbuf.new_from_resource(resource_path);

  image.set_data(
    pixbuf.get_pixels(),
    pixbuf.get_has_alpha()
      ? Cogl.PixelFormat.RGBA_8888
      : Cogl.PixelFormat.RGB_888,
    pixbuf.get_width(),
    pixbuf.get_height(),
    pixbuf.get_rowstride()
  );
  actor.set_content(image);
  actor.content_repeat = Clutter.ContentRepeat.BOTH;
}

//// Debug and development utils

// TODO: move to the imports
const Tiling = Extension.imports.tiling;

// TODO: Remove
export function setDevGlobals() {
  // Accept the risk of this interfering with existing code for now
  metaWindow = Display.focus_window;
  meta_window = Display.focus_window;
  workspace = WorkspaceManager.get_active_workspace();
  actor = metaWindow.get_compositor_private();
  space = Tiling.spaces.spaceOfWindow(metaWindow);
  app = Shell.WindowTracker.get_default().get_window_app(metaWindow);
}

/**
 * Visualize the frame and buffer bounding boxes of a meta window
 */
export function toggleWindowBoxes(metaWindow) {
  metaWindow = metaWindow || Display.focus_window;

  if (metaWindow._paperDebugBoxes) {
    metaWindow._paperDebugBoxes.forEach((box: any) => {
      box.destroy();
    });
    delete metaWindow._paperDebugBoxes;
    return [];
  }

  let frame = metaWindow.get_frame_rect();
  let inputFrame = metaWindow.get_buffer_rect();
  let actor = metaWindow.get_compositor_private();

  // TODO: What is it?
  //       What is the source?
  makeFrameBox = function ({ x, y, width, height }: any, color: string) {
    let frameBox = new imports.gi.St.Widget();
    frameBox.set_position(x, y);
    frameBox.set_size(width, height);
    frameBox.set_style("border: 2px" + color + " solid");
    return frameBox;
  };

  let boxes = [];

  boxes.push(makeFrameBox(frame, "red"));
  boxes.push(makeFrameBox(inputFrame, "blue"));

  if (
    inputFrame.x !== actor.x ||
    inputFrame.y !== actor.y ||
    inputFrame.width !== actor.width ||
    inputFrame.height !== actor.height
  ) {
    boxes.push(makeFrameBox(actor, "yellow"));
  }

  boxes.forEach((box) => global.stage.add_actor(box));

  metaWindow._paperDebugBoxes = boxes;
  return boxes;
}

// TODO: Unclear what to do
const markNewClonesSignalId = null;
export function toggleCloneMarks() {
  // NB: doesn't clean up signal on disable

  function markCloneOf(metaWindow) {
    if (metaWindow.clone) metaWindow.clone.opacity = 190;
  }
  function unmarkCloneOf(metaWindow) {
    if (metaWindow.clone) metaWindow.clone.opacity = 255;
  }

  let windows = Display.get_tab_list(Meta.TabList.NORMAL_ALL, null);

  if (markNewClonesSignalId) {
    Display.disconnect(markNewClonesSignalId);
    markNewClonesSignalId = null;
    windows.forEach(unmarkCloneOf);
  } else {
    markNewClonesSignalId = Display.connect_after("window-created", (_, mw) =>
      markCloneOf(mw)
    );

    windows.forEach(markCloneOf);
  }
}

export function sum(array: any[]) {
  return array.reduce((a, b) => a + b, 0);
}

export function zip(...as: any[]) {
  let r = [];
  let minLength = Math.min(...as.map((x) => x.length));
  for (let i = 0; i < minLength; i++) {
    r.push(as.map((a) => a[i]));
  }
  return r;
}

/**
 * TODO: Remove
 * 3.36 added support for warping in wayland
 * @param x
 * @param y
 */
export function warpPointer(x: number, y: number) {
  if (
    Meta.is_wayland_compositor() &&
    Clutter.Backend.prototype.get_default_seat
  ) {
    let backend = Clutter.get_default_backend();
    let seat = backend.get_default_seat();
    seat.warp_pointer(x, y);
    return;
  } else {
    let display = Gdk.Display.get_default();
    let deviceManager = display?.get_device_manager();
    let pointer = deviceManager?.get_client_pointer();
    pointer?.warp(Gdk.Screen.get_default()!, x, y);
  }
}

export function monitorOfPoint(x: number, y: number) {
  // get_monitor_index_for_rect "helpfully" returns the primary monitor index for out of bounds rects...
  const Main = imports.ui.main;
  for (let monitor of Main.layoutManager.monitors) {
    if (
      monitor.x <= x &&
      x <= monitor.x + monitor.width &&
      monitor.y <= y &&
      y <= monitor.y + monitor.height
    ) {
      return monitor;
    }
  }

  return null;
}

export class Signals extends Map {
  static get [Symbol.species]() {
    return Map;
  }

  _getOrCreateSignals(object: any) {
    let signals = this.get(object);
    if (!signals) {
      signals = [];
      this.set(object, signals);
    }
    return signals;
  }

  connectOneShot(object: any, signal: any, handler: (...args: any[]) => any) {
    let id = this.connect(object, signal, (...args: any) => {
      this.disconnect(object, id);
      return handler(...args);
    });
  }

  connect(object: any, signal: any, handler: any) {
    let id = object.connect(signal, handler);
    let signals = this._getOrCreateSignals(object);
    signals.push(id);
    return id;
  }

  disconnect(object: any, id = null) {
    let ids = this.get(object);
    if (ids) {
      if (id === null) {
        ids.forEach((id: any) => object.disconnect(id));
        ids = [];
      } else {
        object.disconnect(id);
        let i = ids.indexOf(id);
        if (i > -1) {
          ids.splice(i, 1);
        }
      }
      if (ids.length === 0) this.delete(object);
    }
  }

  destroy() {
    for (let [object, signals] of this) {
      signals.forEach((id) => object.disconnect(id));
      this.delete(object);
    }
  }
}

export const Tweener = {
  addTween(
    actor: Actor,
    params: {
      time: number;
      duration: number;
      mode: AnimationMode;
    }
  ) {
    if (params.time) {
      params.duration = params.time * 1000;
      delete params.time;
    }
    if (!params.mode) params.mode = Clutter.AnimationMode.EASE_IN_OUT_QUAD;
    actor.ease(params);
  },

  removeTweens(actor: Actor) {
    actor.remove_all_transitions();
  },

  isTweening(actor: Actor) {
    return (
      actor.get_transition("x") ||
      actor.get_transition("y") ||
      actor.get_transition("scale-x") ||
      actor.get_transition("scale-x")
    );
  },
};
