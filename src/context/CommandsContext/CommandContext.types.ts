export interface ICommand {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => void;
}

export interface ICommandContextProps {
    commands: Map<string, ICommand>;
    addCommand: (command: ICommand) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeCommand: (name: string, ...args: any[]) => void;
    addEventListener: (eventType: string, callback: (event: Event) => void) => void;
    removeEventListener: (eventType: string, callback: (event: Event) => void) => void;
}
