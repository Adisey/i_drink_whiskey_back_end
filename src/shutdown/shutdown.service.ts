import { Injectable } from '@nestjs/common';
import { OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';

type clf = () => void;

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  // Create an rxjs Subject that your application can subscribe to
  private shutdownListener$: Subject<void> = new Subject();
  private close: clf;
  addClose(fn: clf) {
    console.log(+new Date(), '-(addClose)->', typeof fn, `-fn->`, fn);
    this.close = fn;
  }

  down() {
    console.log(
      +new Date(),
      '-(down)->',
      typeof this.close,
      `-this.close->`,
      this.close,
    );
    this.close();
  }

  // Your hook will be executed
  onModuleDestroy() {
    console.log('Executing OnDestroy Hook', 'onModuleDestroy');
  }

  // Subscribe to the shutdown in your main.ts
  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  // Emit the shutdown event
  shutdown(message: string) {
    // ToDo: 01.11.2021 - it's not work ((
    console.log(+new Date(), '-(Shutdown)-####->', `-message->`, message);
    this.shutdownListener$.next();
  }
}
