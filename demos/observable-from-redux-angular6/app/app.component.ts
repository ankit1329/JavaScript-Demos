
// Import the core angular services.
import { Component } from "@angular/core";

// Import the application components and services.
import { ActionTypeA } from "./demo.store";
import { ActionTypeB } from "./demo.store";
import { DemoStore } from "./demo.store";


import { EventTypeA } from "./message-bus-events";
import { EventTypeB } from "./message-bus-events";
import { EventTypeC } from "./message-bus-events";
import { EventTypeD } from "./message-bus-events";
import { EventTypes } from "./message-bus-events";
import { MessageBusGroup } from "./message-bus";
import { MessageBusService } from "./message-bus";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "my-app",
	styleUrls: [ "./app.component.less" ],
	template:
	`
		test
	`
})
export class AppComponent {

	// I initialize the app component.
	constructor( demoStore: DemoStore ) {

		// demoStore.dispatch( new ActionTypeA({ foo: "A" }) );
		// demoStore.dispatch( new ActionTypeA({ foo: "B" }) );

		var s = demoStore.select( "messages" ).subscribe(
			(m) => {
				console.log( "Messages", m.length, m );
			}
		);


		// s.unsubscribe();

		// demoStore.dispatch( new ActionTypeB({ bar: "blamo" }) );
		// demoStore.dispatch( new ActionTypeB({ bar: "blamo" }) );
		// demoStore.dispatch( new ActionTypeB({ bar: "blamo" }) );
		// demoStore.dispatch( new ActionTypeB({ bar: "blamo" }) );
		// demoStore.dispatch( new ActionTypeB({ bar: "blamo" }) );

	}

}
