import { z } from 'zod';
import { map, Observable } from 'rxjs';


export const zodSchemaValidator = <T extends z.ZodSchema>(schema: T) => {
  return (source: Observable<unknown>): Observable<z.infer<T>> =>
    source.pipe(
      map(obj => {
        try {
          return schema.parse(obj);
        } catch (error) {
          console.log(error);
          // Still return data even if incorrectly formatted not to break application
          // (so api response validation doesn't break the flow, but rather informs about the issue)
          return obj;
        }
      })
    );
};
