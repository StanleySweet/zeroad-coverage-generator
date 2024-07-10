import { PyrogenesisEngine } from '../PyrogenesisEngine.js'
import { PyrogenesisContext } from '../PyrogenesisContext.js'
class Program {
  /**
   * Entry point of the program.
   * @returns
   */
  main() {
    (global).Engine = new PyrogenesisEngine();
    const contextFactory = (self) =>
    {
      const obj =  new PyrogenesisContext(self);
      obj.SYSTEM_ENTITY = 1;
      obj.INVALID_PLAYER = -1;
      obj.INVALID_ENTITY = -1;
      return obj;
    };
    global.Engine.TestModule("maps/random/tests", contextFactory);
    return 0;
  }
}

const program = new Program();
program.main();
