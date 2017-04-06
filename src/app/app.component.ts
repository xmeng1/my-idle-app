import { Component } from '@angular/core';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Xin Session timeout demo!';

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  currentTime = 0;
  universalTimer: any;
  mockIsBackendLogin = false;
  mockBackendSessionTimeout = 11000;
  mockBackendTimer: any;
  frontendSessionTimeout = 10;
  debug_information = 'debug information display';

  backendTimer: any;
  frontendTimer: any;

  constructor(private idle: Idle, private keepalive: Keepalive) {
    this.mockLogin();

    this.universalTimer = setInterval(() => {
      // console.log(this.currentTime + 'universalTimer');
      this.currentTime++; }, 1000);

    this.mockBackendTimer = setInterval(() => {
      console.log(this.currentTime + ' mockBackendTimer: it mock the backend session timeout');
      this.mockIsBackendLogin = false; }, this.mockBackendSessionTimeout);

    // this.mockResetSessionTimer();

    setTimeout(() => {
      this.myApi();
    }, 8000);

    // setTimeout(() => {
    //   this.myApi();
    // }, 25000);
    //
    //
    // setTimeout(() => {
    //   this.myApi();
    // }, 45000);
    //
    //
    // setTimeout(() => {
    //   this.myApi();
    // }, 65000);

    this.backendTimer = setInterval(() => {
      console.log(this.currentTime + ' backendTimer: this timer will keep the client connect to server always');
      console.log(' backendTimer: this timer will keep the client connect to server always');
      this.mockApi(); }, this.mockBackendSessionTimeout - 1000);

    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(9);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(4);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {this.idleState = ' No longer idle.';
      console.log(this.currentTime + ' No longer idle.'); });
    idle.onTimeout.subscribe(() => {
      this.mockLogout();
      this.idleState = ' Timed out!';
      console.log(this.currentTime + ' Timed out!');
      this.timedOut = true;
    });
    idle.onIdleStart.subscribe(() => {this.idleState = ' You\'ve gone idle!';
      console.log(this.currentTime + this.idleState);
    });
    idle.onTimeoutWarning.subscribe((countdown) => {this.idleState = ' You will time out in ' + countdown + ' seconds!';
      console.log(this.currentTime + this.idleState); });

    // sets the ping interval to 15 seconds
    keepalive.interval(1);

    keepalive.onPing.subscribe(() => {
      console.log(this.currentTime + ' onPing!');
      this.lastPing = new Date();
    console.log(this.currentTime + this.lastPing.toUTCString()); });

    keepalive.onPingResponse.subscribe(() => {
      console.log(this.currentTime + ' onPingResponse!');
      this.lastPing = new Date(); });

    this.reset();
  }
  reset() {
    this.idle.watch();
    this.idleState = this.currentTime + ' Started.';
    this.timedOut = false;
  }

  /**
   * All the function with mock is just mock for backend
   *
   *
   */
  mockResetSessionTimer() {
    console.log(this.currentTime + ' mockResetSessionTimer: mock server session reset');
    clearInterval(this.mockBackendTimer);
    this.mockBackendTimer = setInterval(() => {this.mockIsBackendLogin = false; }, this.mockBackendSessionTimeout);
  }

  mockApi() {
    console.log(this.currentTime + ' mockApi: mock server side api is invoked');
    this.mockResetSessionTimer();
  }

  myApi() {
    console.log(this.currentTime + ' myApi: my front end api is invoked!');
    this.mockApi();
    clearInterval(this.backendTimer);
    this.backendTimer = setInterval(() => {
      console.log(this.currentTime + ' backendTimer: this timer will keep the client connect to server always');
      this.mockApi(); }, this.mockBackendSessionTimeout - 1000);
  }

  mockLogin() {
    console.log(this.currentTime + ' mock login');
    this.mockIsBackendLogin = true;
  }
  mockLogout() {
    console.log(this.currentTime + ' mock out');
    clearInterval(this.backendTimer);
    clearInterval(this.mockBackendTimer);
    clearInterval(this.universalTimer);
    this.mockIsBackendLogin = false;
  }
}
