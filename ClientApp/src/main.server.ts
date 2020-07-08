
// tslint:disable
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { INITIAL_CONFIG, platformDynamicServer, PlatformState } from '@angular/platform-server';
import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode, ApplicationRef, NgZone } from '@angular/core';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { first } from 'rxjs/operators';
import * as cache from 'memory-cache';
import { StatusCodeService } from './app/services/status-code.service';
export { AppServerModule } from './app/app.server.module';

enableProdMode();

export default createServerRenderer(params => {
  const { AppServerModule, AppServerModuleNgFactory, LAZY_MODULE_MAP } = (module as any).exports;


  const providers = [
    provideModuleMap(LAZY_MODULE_MAP),
    { provide: INITIAL_CONFIG, useValue: { document: params.data.originalHtml, url: params.url } },
    { provide: APP_BASE_HREF, useValue: params.baseUrl },
    { provide: 'BASE_URL', useValue: params.origin + params.baseUrl }
  ];

  const cachedEntry = cache.get(params.url);
  if (cachedEntry) {
    return new Promise<RenderResult>((resolve) => {
      resolve(cachedEntry);
    })
  }

  const renderPromise = AppServerModuleNgFactory
    ? /* AoT */ platformDynamicServer(providers).bootstrapModuleFactory(AppServerModuleNgFactory)
    : /* dev */ platformDynamicServer(providers).bootstrapModule(AppServerModule);

  return renderPromise.then(moduleRef => {
    try {
      const appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
      const state = moduleRef.injector.get(PlatformState);
      const zone = moduleRef.injector.get(NgZone);

      // this will get the instance of the HttpStatusCodeService created for this request.
      const statusCodeService = moduleRef.injector.get(StatusCodeService);

      return new Promise<RenderResult>((resolve, reject) => {
        try {
          zone.onError.subscribe((errorInfo: any) => reject(errorInfo), error => reject(error));
          appRef.isStable
            .pipe(first(isStable => isStable))
            .subscribe(() => {
              // Because 'onStable' fires before 'onError', we have to delay slightly before
              // completing the request in case there's an error to report
              setImmediate(() => {
                const result = {
                  html: state.renderToString(),
                  // this will get the currently set status code and return it along with the prerendered html string
                  statusCode: statusCodeService.getStatusCode()
                }
                cache.put(params.url, result, 20 * 60 * 1000);
                resolve(result);

                moduleRef.destroy();

              });
            }, error => reject(error));
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      return Promise.reject(error);
    }
  });
});
