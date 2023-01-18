// eslint-disable-next-line no-unused-vars
class LMSM {
  program_counter = 0;
  accumulator = 0;
  current_instruction = 0;
  stack_pointer = 200;
  return_address_pointer = 99;
  halt = true;
  output = [`Started LMSM.`];


  reset() {
    this.program_counter = 0;
    this.accumulator = 0;
    this.current_instruction = 0;
    this.stack_pointer = 200;
    this.return_address_pointer = 99;
    this.halt = true;
    this.output = [`Started LMSM.`];
    this.memory = new Array(200).fill("000");
  }

  clearOutput() {
    this.output = [];
  }

  outputFunction = (value, lmsm) => {
    lmsm.output.push(value);
  };
  userInputFunction = () => {
    return window.prompt("Enter a value");
  };

  memory = new Array(200).fill("000");

  instructionMap = [
    [/1(\d\d)/, "ADD", "ADD <XX>	Adds the value located in memory at position XX to the value of the accumulator.", (opcode, lmsm) => {
      const memoryPosition = parseInt(opcode.substring(1));
      lmsm.accumulator += lmsm.memory[memoryPosition + 100];
    },],
    [/2(\d\d)/, "SUB", "SUB <XX>	Subtracts the value located in memory at position XX to the value of the accumulator.", (opcode, lmsm) => {
      const memoryPosition = parseInt(opcode.substring(1));
      lmsm.accumulator -= lmsm.memory[memoryPosition];
    },],
    [/3(\d\d)/, "STA", "STA <XX>	Stores the value of the accumulator to the memory location at position XX", (opcode, lmsm) => {
      const memoryPosition = parseInt(opcode.substring(1));
      lmsm.memory[memoryPosition] = lmsm.accumulator;
    },],
    [/4(\d\d)/, "LDI", "LDI <XX> 	Loads the numeric value XX directly into the accumulator.", (opcode, lmsm) => {
      const value = parseInt(opcode.substring(1));
      lmsm.accumulator = value;
    },],
    [/5(\d\d)/, "LDA", "LDA <XX>	Loads the value of the memory location at position XX into the accumulator.", (i, lmsm) => {
      const memoryPosition = parseInt(i.substring(1));
      lmsm.accumulator = lmsm.memory[memoryPosition];
    },],
    [/6(\d\d)/, "BRA", "BRA <XX>	Unconditionally sets the program counter to the given value", (i, lmsm) => {
      const value = parseInt(i.substring(1));
      lmsm.program_counter = value;
    },],
    [/7(\d\d)/, "BRZ", "BRZ <XX>	Sets the program counter to the given value if and only if the value of the accumulator is 0", (i, lmsm) => {
      if (lmsm.accumulator === 0) {
        const value = parseInt(i.substring(1));
        lmsm.program_counter = value;
      }
    },],
    [/8(\d\d)/, "BRP", "BRP <XX>	Sets the program counter to the given value if and only if the value of the accumulator is 0 or a number greater than 0", (i, lmsm) => {
      if (lmsm.accumulator >= 0) {
        const value = parseInt(i.substring(1));
        lmsm.program_counter = value;
      }
    },],
    [/900/, "NOOP", "NOOP Does nothing", (i, lmsm) => {
    },],
    [/901/, "INP", "INP	Gets a numeric value from the user and stores it in the accumulator", (i, lmsm) => {
      const userInput = lmsm.userInputFunction();
      lmsm.accumulator = userInput;
    },],
    [/902/, "OUT", "OUT	Prints the current value of the accumulator to output", (i, lmsm) => {
      lmsm.outputFunction(lmsm.accumulator, lmsm);
    },],

    [/920/, "SPUSH", "SPUSH	Pushes the value of the accumulator onto the top of the value stack, by decrementing the stack_pointer register by 1 and then copying the value from the accumulator to the memory location that the stack_pointer points to.", (i, lmsm) => {
      --lmsm.stack_pointer;
      lmsm.memory[lmsm.stack_pointer] = lmsm.accumulator;
    },],
    [/921/, "SPOP", "SPOP	Pop the value off top of the value stack into the accumulator by copying the value in the memory location that the stack_pointer points to the accumulator and then incrementing the stack_pointer.", (i, lmsm) => {
      lmsm.accumulator = lmsm.memory[lmsm.stack_pointer];
      lmsm.stack_pointer++;
    },],
    [/922/, "SDUP", "SDUP	Duplicates the top of the value stack by decrementing the value of the stack_pointer and then copying the value directly above the memory location that the stack_pointer points to to the memory location that the stack_pointer points to.", (i, lmsm) => {
      lmsm.stack_pointer--;
      lmsm.memory[lmsm.stack_pointer + 1] = lmsm.memory[lmsm.stack_pointer];
    },],
    [/923/, "SDROP", "SDROP	Drops the top of the value stack by incrementing the value of the stack_pointer.", (i, lmsm) => {
      lmsm.stack_pointer++;
    },],
    [/924/, "SSWAP", "SSWAP	Swaps the top of the value stack by swapping the value in the memory location directly above the memory location that the stack_pointer points to with the value in the memory location that the stack_pointer points to.", (i, lmsm) => {
      lmsm.memory[lmsm.stack_pointer + 1] = lmsm.memory[lmsm.stack_pointer];
    },],
    [/930/, "SADD", "SADD	Removes the top two values on the stack, adds them together and places the result onto the stack.", (i, lmsm) => {
      const op1 = lmsm.memory[lmsm.stack_pointer];
      lmsm.stack_pointer++;
      const op2 = lmsm.memory[lmsm.stack_pointer];
      lmsm.memory[lmsm.stack_pointer] = op1 + op2;
    },],
    [/931/, "SSUB", "SSUB	Removes the top two values on the stack, subtracts them and places the result onto the stack.", (i, lmsm) => {
      const op1 = lmsm.memory[lmsm.stack_pointer];
      lmsm.stack_pointer++;
      const op2 = lmsm.memory[lmsm.stack_pointer];
      lmsm.memory[lmsm.stack_pointer] = op1 - op2;
    },],
    [/932/, "SMUL", "SMUL	Removes the top two values on the stack, multiplies them and places the result onto the stack.", (i, lmsm) => {
      const op1 = lmsm.memory[lmsm.stack_pointer];
      lmsm.stack_pointer++;
      const op2 = lmsm.memory[lmsm.stack_pointer];
      lmsm.memory[lmsm.stack_pointer] = op1 * op2;
    },],
    [/933/, "SDIV", "SDIV	Removes the top two values on the stack, divides them and places the result onto the stack.", (i, lmsm) => {
      const op1 = lmsm.memory[lmsm.stack_pointer];
      lmsm.stack_pointer++;
      const op2 = lmsm.memory[lmsm.stack_pointer];
      lmsm.memory[lmsm.stack_pointer] = op1 / op2;
    },],
    [/934/, "SMAX", "SMAX	Removes the top two values on the stack, and places the maximum of the two values back on the stack.", (i, lmsm) => {
      const op1 = lmsm.memory[lmsm.stack_pointer];
      lmsm.stack_pointer++;
      const op2 = lmsm.memory[lmsm.stack_pointer];
      lmsm.memory[lmsm.stack_pointer] = Math.max(op1, op2);
    },],
    [/935/, "SMIN", "SMIN	Removes the top two values on the stack, and places the minimum of the two values back on the stack.", (i, lmsm) => {
      const op1 = lmsm.memory[lmsm.stack_pointer];
      lmsm.stack_pointer++;
      const op2 = lmsm.memory[lmsm.stack_pointer];
      lmsm.memory[lmsm.stack_pointer] = Math.min(op1, op2);
    },],
    [/910/, "JAL", "JAL	The Jump And Link instruction updates the program counter to the value that the stack pointer currently points to and then increases the value of the return address register by one and saves the address of the next instruction after the Jump And Link", (i, lmsm) => {
      lmsm.program_counter = lmsm.stack_pointer;
      lmsm.return_address_pointer++;

    },],
    [/911/, "RET", "RET	The Return instruction updates the program counter to the value that the return address pointer currently points to and then decreases the value of the return address register by one.",],
    [/0/, "HLT", "HLT	Halts the system, ending the execution loop", (i, lmsm) => {
      lmsm.halt = true;
    },],
    // [ /DAT <XXX>	An assembler-only instruction that allows a program to insert a raw value into a given memory location  [/2(..)/, (i) => { console.log("sub"); }, "SUB"],
  ];

  instructionCycle() {
    this.current_instruction = this.memory[this.program_counter];
    this.program_counter++;
    this.executeInstruction(this.current_instruction);
  }

  executeInstruction(opcode) {
    console.debug(opcode);
    const instruction = this.instructionMap.find((im) => {
      const re = new RegExp(im[0]);
      return opcode.match(re);
    });
    const runner = instruction[3];
    runner(opcode, this);
  }

  load(program) {
    this.reset();
    this.halt = false;
    if (!program || program === "") return;
    const opcodes = program.split("\n");
    this.program_counter = 0;
    this.memory.fill(0);
    opcodes.filter((opcode) => opcode && opcode.trim() !== "").forEach((opcode, i) => {
      this.memory[i] = opcode;
    });
  }

  step() {
    try {
      if (!this.halt) {
        this.instructionCycle();
      }
    } catch (err) {
      this.halt = true;
    }
  }

  run() {
    try {
      while (!this.halt) {
        this.instructionCycle();
      }
    } catch (err) {
      this.halt = true;
    }
  }
}
class LMSMAssembler {

  static pseudoInstruction = -1;

  instructionMap = [
    [/ADD (\d\d?)/, (param) => 100 + param],
    [/SUB (\d\d?)/, (param) => 200 + param],
    [/STA (\d\d?)/, (param) => 300 + param],
    [/LDI (\d\d?)/, (param) => 400 + param],
    [/LDA (\d\d?)/, (param) => 500 + param],
    [/BRA (\d\d?)/, (param) => 600 + param],
    [/BRZ (\d\d?)/, (param) => 700 + param],
    [/BRP (\d\d?)/, (param) => 800 + param],
    [/NOOP/, () => 900],
    [/INP/, () => 901],
    [/OUT/, () => 902],
    [/SPUSH/, () => 920],
    [/SPOP/, () => 921],
    [/SDUP/, () => 922],
    [/SDROP/, () => 923],
    [/SSWAP/, () => 924],
    [/SADD/, () => 930],
    [/SSUB/, () => 931],
    [/SMUL/, () => 932],
    [/SDIV/, () => 933],
    [/SMAX/, () => 934],
    [/SMIN/, () => 935],
    [/JAL/, () => 910],
    [/RET/, () => 911],
    [/HLT/, () => 0],
    [/DAT/, () => LMSMAssembler.pseudoInstruction],
  ];

  assemble(program) {
    if (!program || program === "") return;
    const lines = program.split("\n");
    const opcodes = lines.filter((line) => line !== "").map((i) => {
      let match;
      const matched = this.instructionMap.find((im) => {
        const re = new RegExp(im[0]);
        match = i.toUpperCase().match(re);
        return match;
      });
      if (!matched) {
        throw new Error(`invalid assembly instruction: ${i}`);
      }
      const param = parseInt(match[1]);
      return matched[1](param);
    });
    const assembled = opcodes.join("\n");
    return assembled;
  }
}

class FirthCompiler {
  compile(program) { }
}

class AssemblyMode {
  constructor() {
    CodeMirror.defineSimpleMode("lmsm-assembly", {
      start: [
        {
          regex: /(?:DAT|ADD|SUB|STA|LDI|LDA|BRA|BRZ|BRP|NOOP|INP|OUT|SPUSH|SPOP|SDUP|SDROP|SSWAP|SADD|SSUB|SMUL|SDIV|SMAX|SMIN|JAL|RET|HLT|dat|add|sub|sta|ldi|lda|bra|brz|brp|noop|inp|out|spush|spop|sdup|sdrop|sswap|sadd|ssub|smul|sdiv|smax|smin|jal|ret|hlt)\b/,
          token: "keyword"
        },
        {
          regex: /\d\d/,
          token: "number",
        },
      ],
    });
  }
}