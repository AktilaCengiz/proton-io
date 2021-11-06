
// Imports
import type { Client, ClientOptions, UserResolvable, Collection, PermissionString, Message, User } from "discord.js";
import type { EventEmitter } from "events";
import type { Model } from "mongoose";

// Classes
export class ProtonClient extends Client {
    public constructor(options: ProtonClientOptions & ClientOptions);
    public owners: StringOrStringArray;
    public isOwner(resolvable: UserResolvable): boolean;
}
export class ProtonHandler extends EventEmitter {
    public constructor(client: ProtonClient, options: ProtonHandlerOptions);
    public client: ProtonClient;
    public directory: string;
    public automateCategories: boolean;
    public modules: Collection<string, ProtonModule>;
    public register(mod: ProtonModule, filepath?: string): void;
    public deregister(mod: ProtonModule): void;
    public load(fileOrFn: string | Function): ProtonModule | undefined | null;
    public loadAll(): this;
    public reload(id: string): ProtonModule | undefined | null;
    public reloadAll(): this;
    public remove(id: string): ProtonModule;
    public removeAll(): this;
}

export class ProtonModule {
    public constructor(id: string, options?: ProtonModuleOptions);
    public id: string;
    public category: string;
    public filepath?: string;
    public client: ProtonClient;
    public handler: ProtonHandler;
    public execute(...args: unknown[]): any;
    public reload(): this;
    public remove(): this;
}

export class CommandHandler extends ProtonHandler {
    public constructor(client: ProtonClient, options: CommandHandlerOptions);
    public prefix: StringOrStringArray | PrefixRouter;
    public ignoreSelf: boolean;
    public ignoreBots: boolean;
    public defaultCooldown?: number;
    public defaultRateLimit?: number;
    public defaultTyping: boolean;
    public defaultUserPermissions: StringOrArrayPermission | PermissionsRouter;
    public defaultClientPermissions: StringOrArrayPermission | PermissionsRouter;
    public aliasManager: AliasManager;
    public cooldownManager: CooldownManager;
    public register(mod: Command): void;
    public deregister(mod: Command): void;
    private init(): void;
    private handle(message: Message): Promise<void>;
    private _parse(message: Message, prefix: string): { args: string[], command?: Command };
}

export class AliasManager extends CachedManager<string, string>{
    public register(alias: string, commandId: string): this;
}

export class CommandCooldown extends CachedManager<string, CooldownState>{
    public initState(user: User): this;
}

export class CooldownManager extends CachedManager<string, CommandCooldown> {
    public init(command: Command): CommandCooldown;
}

export class Command extends ProtonModule {
    public constructor(id: string, options?: CommandOptions);
    public aliases?: StringOrStringArray;
    public ownerOnly: boolean;
    public cooldown?: number;
    public information?: object;
    public userPermissions?: StringOrArrayPermission | PermissionsRouter;
    public clientPermissions?: StringOrArrayPermission | PermissionsRouter;
    public executable: boolean;
    public rateLimit?: number;
    public typing?: boolean;
}

export class CommandRunner extends EventEmitter {
    public constructor(handler: CommandHandler, command: Command);
    public handler: CommandHandler;
    public command: Command;
    public tryRun(message: Message): void;
    private _checkPermissions(message: Message, command: Command, { isOwner }: { isOwner: boolean }): Promise<boolean>;
    private _handleCooldowns(message: Message, command: Command): boolean;
}

export class CachedManager<KT, VT> {
    public constructor();
    public cache: Collection<KT, VT>;
    public register(key: KT, value: VT): this;
    public deregister(key: KT): this;
}

export class Listener extends ProtonModule {
    public constructor(id: string, options: ListenerOptions);
    public emitter: string;
    public event: string;
    public type: string;
}

export class ListenerHandler extends ProtonHandler {
    public emitters: Collection<string, EventEmitter>;
    public register(listener: Listener, filepath?: string): void;
    public deregister(listener: Listener): void;
    public setEmitter(id: string, emitter: EventEmitter): void;
    public setEmitters(emitters: Record<string, EventEmitter>): this;
}

export class MongooseProvider {
    public constructor(model: Model<unknown>);
    public model: Model<unknown>;
    public set(datas: object): void;
    public get(objectFetchDatas: object, defaultValue?: string): Promise<unknown>;
    public update(objectFetchDatas: object, updatedDatas: object): void;
    public delete(objectFetchDatas: object): void;
    public getall(): unknown;
}

export class MySqlProvider {
    public constructor(connection: any);
    public connection: any;
    public set(id: string, savedDatas: object): void;
    public get(id: string, defaultValue?: string): Promise<unknown>;
    public delete(id: string): void;
    public update(id: string, updatedDatas: object): void;
}

export class SqlProvider {
    public constructor(sql: any);
    public sql: any;
    public set(id: string, savedDatas: object): void;
    public get(id: string, defaultValue: string): unknown;
    public delete(id: string): void;
    public update(id: string, updatedDatas: object): void;
}


// Interfaces
export interface ProtonClientOptions {
    owners?: StringOrStringArray;
}

export interface ProtonHandlerOptions {
    directory?: string;
    automateCategories?: boolean;
}

export interface ProtonModuleOptions {
    category?: string;
}

export interface CommandHandlerOptions extends ProtonHandlerOptions {
    prefix?: StringOrStringArray | PrefixRouter;
    ignoreSelf?: boolean;
    ignoreBots?: boolean;
    defaultCooldown?: number;
    defaultRateLimit?: number;
    defaultTyping?: boolean;
    defaultUserPermissions?: StringOrArrayPermission | PermissionsRouter;
    defaultClientPermissions?: StringOrArrayPermission | PermissionsRouter;
}

export interface CommandOptions extends ProtonModuleOptions {
    aliases?: StringOrStringArray;
    ownerOnly?: boolean;
    cooldown?: number;
    information?: object;
    userPermissions?: PermissionString | PermissionString[] | PermissionsRouter;
    clientPermissions?: PermissionString | PermissionString[] | PermissionsRouter;
    executable?: boolean;
    rateLimit?: number;
    typing?: boolean;
}

export interface CooldownState {
    usageSize: number;
    end: number;
}

export interface ListenerOptions extends ProtonModuleOptions {
    emitter: string;
    event: string;
    type?: string;
}

export interface ListenerHandlerOptions extends ProtonHandlerOptions { }

export interface Utils {
    readdir: (path: string) => string[];
}

// Types
export type PermissionsRouter = (message: Message) => unknown;
export type PrefixRouter = (message: Message) => StringOrStringArray | Promise<StringOrStringArray>;


type StringOrStringArray = string | string[];
type StringOrArrayPermission = PermissionString | PermissionString[];
