import { AxiosInstance } from 'axios';
import * as hoistStatics from 'hoist-non-react-statics';
import * as invariant from 'invariant';
import { Component, ComponentClass, createElement, PropTypes, StatelessComponent } from 'react';

// tslint:disable-next-line variable-name
function getDisplayName(WrappedComponent: any) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withAxios<T, TOwnProps>(getCreateProps: (http: AxiosInstance) => T | ((ownProps?: TOwnProps) => T)) {
  // tslint:disable-next-line variable-name
  return (WrappedComponent: ComponentClass<TOwnProps> | StatelessComponent<TOwnProps>): ComponentClass<TOwnProps> => {
    class WithAxios extends Component<TOwnProps, void> {
      static contextTypes = {
        axios: PropTypes.func,
      };

      private http: AxiosInstance;

      constructor(props: any, context: any) {
        super(props);
        this.http = context.axios;
        invariant(this.http, 'missing context.axios');
      }

      // tslint:disable-next-line member-ordering
      render() {
        const createProps = getCreateProps(this.http);
        const extraProps = typeof createProps === 'function' ? createProps(this.props) : createProps;

        return createElement(WrappedComponent as any, {
          ...this.props as any,
          ...extraProps as any,
        });
      }
    }

    (WithAxios as any).WrappedComponent = WrappedComponent;
    (WithAxios as any).displayName = `WithAxios(${getDisplayName(WrappedComponent)})`;

    return hoistStatics(WithAxios, WrappedComponent);
  };
}

export default withAxios;
