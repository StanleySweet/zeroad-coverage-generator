import { PyrogenesisEngine } from '../PyrogenesisEngine.js'
import { PyrogenesisContext } from '../PyrogenesisContext.js'
class Program {
  /**
   * Entry point of the program.
   * @returns
   */
  main() {
    new PyrogenesisEngine().TestModule("globalscripts/tests", (self) => new PyrogenesisContext(self));
    return 0;
  }
}

const program = new Program();
program.main();
