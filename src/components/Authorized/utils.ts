import React from 'react';

export type IReactComponent<P = any> =
  | React.StatelessComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;

type authorityFN = (currentAuthority?: string) => boolean;

export type authorityType = string | string[] | authorityFN;

// Determine whether the incoming component has been instantiated
// AuthorizedRoute is already instantiated
// Authorized  render is already instantiated, children is no instantiated
// Secured is not instantiated
export const checkIsInstantiation = (target: IReactComponent): IReactComponent => {
  if (!React.isValidElement(target)) {
    return target;
  }
  return () => target;
};
