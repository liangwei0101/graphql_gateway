import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { BuildServiceModule } from './module/buildService.module';
import { GATEWAY_BUILD_SERVICE, GraphQLGatewayModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLGatewayModule.forRootAsync({
      useFactory: async () => ({
        server: {
          // ... Apollo server options
          cors: true,
          context: ({ req }) => ({
            jwt: req.headers.authorization,
          }),
        },
        gateway: {
          serviceList: [
            { name: 'server1', url: 'http://127.0.0.1:3000/graphql' },
            { name: 'server2', url: 'http://127.0.0.1:3001/graphql' },
          ],
          // 5s 轮询一次
          experimental_pollInterval: 5000,
        },
      }),
      imports: [BuildServiceModule],
      inject: [GATEWAY_BUILD_SERVICE],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
