#TypeScript开发React Router4(react-router)使用类型参数和注入属性的方式处理路由
react-router

// Routed.ts — 自定义的路由处理器_
```
import { RouteComponentProps, match } from 'react-router';
import { History, Location } from 'history';

// re-export for convenience, uppercase match to be in line with everything else
export { History, Location, match as Match };

// names for the three types we support injecting
type InjectionPropType = 'location' | 'history' | 'match';

// holder for a given property to be injected as a specific type
class InjectionProp {
  prop: string;
  type: InjectionPropType;
}

// a store, key = class name (constructor.name) and array of InjectionProp's for that class
// this will be filled in by the three property decorators @RoutedMatch, @RoutedLocation and @RoutedHistory
class InjectionStore {
  [key: string]: InjectionProp[];
}

// instance of the store
const store: InjectionStore = {};

// type guard for RouteComponentProps
function instanceOfRouteProps<P>(object: any): object is RouteComponentProps<P> {
  return 'match' in object && 'location' in object && 'history' in object;
}

// class level decorator, wraps the constructor with custom one which injects
// values into instances based on the InjectionStore instance
export function Routed<T extends { new (...args: any[]): {} }>(constructor: T) {

  // get the class name from the constructor
  const className = (constructor as any).name;

  // return a new class with a new constructor which calls super(..)
  return class extends constructor {

    constructor(...args: any[]) {
      super(args);

      // if there is a React props passed as arg[0]
      if (args.length >= 1) {

        const routeProps = args[0];

        // check type guard to see if the React props is enriched with RouteComponentProps by react-router
        if (instanceOfRouteProps(routeProps)) {
          // check if the current class has any registered properties to be injected
          if (store[className]) {
            const injectionProps = store[className];
            // iterate over properties to inject
            for (let i = 0; i < injectionProps.length; i++) {
              const injectionProp = injectionProps[i];
              // inject the specified property with the appropriate type
              switch (injectionProp.type) {
                case 'match':
                  (this as any)[injectionProp.prop] = routeProps.match;
                  break;
                case 'history':
                  (this as any)[injectionProp.prop] = routeProps.history;
                  break;
                case 'location':
                  (this as any)[injectionProp.prop] = routeProps.location;
                  break;
              }
            }
          }
        }
      }
    }
  }
}

// generic property decorator, registers a classes property for inject in the store above
function RoutedInjector(proto: any, prop: string, type: InjectionPropType): any {
  const className = proto.constructor.name;
  if (!store.hasOwnProperty(className)) {
    store[className] = [];
  }
  store[className].push({
    prop: prop,
    type: type
  });
}

// property decorator for Match instances
export function RoutedMatch(proto: any, prop: string): any {
  RoutedInjector(proto, prop, 'match');
}

// property decorator for Location instances
export function RoutedLocation(proto: any, prop: string): any {
  RoutedInjector(proto, prop, 'location');
}

// property decorator for History instances
export function RoutedHistory(proto: any, prop: string): any {
  RoutedInjector(proto, prop, 'history');
}
```

// index.ts_

```
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Link, match } from 'react-router-dom';

import { History, Location, Match, Routed, RoutedHistory, RoutedLocation, RoutedMatch } from './Routed';

// define React components for multiple pages
class Home extends React.Component<any, any> {
  render() {
    return (
      <div>
        <div>HOME</div>
        <div><Link to='/details/id123'>Goto Details</Link></div>
      </div>);
  }
}

interface DetailParams {
  id: string;
}

interface DetailsProps {
  required: string;
}

@Routed
class Details extends React.Component<DetailsProps, any> {

  @RoutedMatch
  match: Match<DetailParams>;

  @RoutedLocation
  location: Location;

  @RoutedHistory
  history: History;

  render() {
    return (
      <div>
        <div>Details for {this.match.params.id} on location {this.location.pathname}</div>
        <span
          onClick={(e) => this.history.push('/')}
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
        >Goto Home</span>
      </div>
    );

  }
}

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/details/:id" component={(props) => <Details required="some string" {...props} />} />
    </div>
  </Router>

  , document.getElementById('root')
);
```
