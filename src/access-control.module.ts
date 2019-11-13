import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { RolesBuilder } from './roles-builder.class';
import { ROLES_BUILDER_TOKEN } from './constants';
import { GrantsController } from './grants.controller';
import { ACOptions } from './ac-options.interface';

@Global()
@Module({})
export class AccessControlModule {
  /**
   * Register a pre-defined roles
   * @param {RolesBuilder} roles  A list containing the access grant
   * @param {ACOptions} options  A configurable options
   * definitions. See the structure of this object in the examples.
   */
  public static forRoles(roles: RolesBuilder, options?: ACOptions): DynamicModule {
    let controllers = [];

    if (options) {
      Reflect.defineMetadata(PATH_METADATA, options.grantsEndpoint, GrantsController);
      controllers = [...(options.grantsEndpoint ? [GrantsController] : [])];
    }

    return {
      module: AccessControlModule,
      controllers: [...controllers],
      providers: [
        {
          provide: ROLES_BUILDER_TOKEN,
          useValue: roles,
        },
      ],
      exports: [
        {
          provide: ROLES_BUILDER_TOKEN,
          useValue: roles,
        },
      ],
    };
  }

  public static forRootAsync(options: {
    inject?: Provider<any>[];
    useFactory: (...args: any) => RolesBuilder | Promise<RolesBuilder>;
  }): DynamicModule {
    const provider = {
      provide: ROLES_BUILDER_TOKEN,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: AccessControlModule,
      providers: [...provider.inject],
      exports: [...provider.inject],
    };
  }
}
