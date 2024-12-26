import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import AsyncLoadingComponent from '../components/common/AsyncLoadingComponent';
import AsyncErrorComponent from '../components/common/AsyncErrorComponent';
import { useMonitoring } from '../hooks/useMonitoring';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      error: null, 
      errorInfo: null 
    };
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    onError: PropTypes.func,
    componentName: PropTypes.string
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, {
        component: this.props.componentName,
        errorInfo
      });
    }
  }

  retry = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    if (this.state.error) {
      return (
        <AsyncErrorComponent
          error={this.state.error}
          retry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}

const withAsyncLoading = (WrappedComponent, componentName = 'UnknownComponent') => {
  const WithAsyncLoadingComponent = (props) => {
    const { trackError } = useMonitoring(componentName);

    return (
      <Suspense fallback={<AsyncLoadingComponent />}>
        <ErrorBoundary onError={trackError} componentName={componentName}>
          <WrappedComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  };

  WithAsyncLoadingComponent.displayName = `WithAsyncLoading(${componentName})`;
  
  return WithAsyncLoadingComponent;
};

export default withAsyncLoading;