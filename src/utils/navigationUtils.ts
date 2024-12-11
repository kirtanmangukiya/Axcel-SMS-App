// src/utils/navigationUtils.ts
import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

let navigationRef: NavigationContainerRef | null = null;

export function setNavigationRef(ref: NavigationContainerRef) {
  navigationRef = ref;
}

export function resetNavigationStack(routeName: string, params?: object) {
  if (navigationRef?.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: routeName, params}],
      }),
    );
  }
}
