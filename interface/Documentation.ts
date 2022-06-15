type StatusCodePositiveInfo = 100 | 101 | 102 | 103;
type StatusCodePositiveSuccess =
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 218 // Apache Web Server
  | 226;
type StatusCodePositiveRedirect =
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 306
  | 307
  | 308;

type StatusCodeNegativeClient =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 419 // Laravel Framework
  | 420 // Spring Framework
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 430 // Shopify
  | 431
  | 440 // IIS
  | 449 // NGINX
  | 449 // IIS
  | 450 // Microsoft
  | 451
  | 460 // AWS ELB
  | 494 // NGINX
  | 495 // NGINX
  | 496 // NGINX
  | 497 // NGINX
  | 499; // NGINX
type StatusCodeNegativeServer =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509 // Apache Web Server
  | 510
  | 511
  | 520 // Cloudflare
  | 521 // Cloudflare
  | 522 // Cloudflare
  | 523 // Cloudflare
  | 524 // Cloudflare
  | 525 // Cloudflare
  | 526 // Cloudflare
  | 527 // Cloudflare
  | 561; // AWS ELB

interface ResponseDetailDefinition {
  statusCode:
    | StatusCodePositiveInfo
    | StatusCodePositiveSuccess
    | StatusCodePositiveRedirect
    | StatusCodeNegativeClient
    | StatusCodeNegativeServer;
  response: string | object;
}

interface RequestDocumentation {
  query?: object;
  params?: object;
  body?: object;
  headers?: object;
}
interface ResponseDocumentation {
  // Positive Case
  info?: ResponseDetailDefinition;
  success: ResponseDetailDefinition;
  redirect?: ResponseDetailDefinition;
  // Negative Case
  client: ResponseDetailDefinition;
  server?: ResponseDetailDefinition;
}

export interface DocumentationDefinition {
  // Method name within our class responsible for this route
  methodName: string;
  description: string;
  request?: RequestDocumentation;
  response: ResponseDocumentation;
}
