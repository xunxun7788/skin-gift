import mitt, { type Emitter } from "mitt";

type Events = {
  toggleMainMenu: { isOpen: boolean };
  refreshRoute: void;
};

const emitter: Emitter<Events> = mitt<Events>();

export default emitter;
