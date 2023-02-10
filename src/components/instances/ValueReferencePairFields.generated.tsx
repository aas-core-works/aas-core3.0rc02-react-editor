//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.ValueReferencePair|ValueReferencePair}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as help from './help.generated';
import * as newinstancing from '../../newinstancing.generated';

export function ValueReferencePairFields(
  props: {
    snapInstance: Readonly<aas.types.ValueReferencePair>,
    instance: aas.types.ValueReferencePair,
  }
) {
  return (
    <>
      <fields.TextFieldRequired
        label="Value"
        helpUrl={
          `${help.ROOT_URL}/Value_reference_pair.html#property-value`
        }
        value={props.snapInstance.value}
        onChange={
          (value) => {
            props.instance.value = value;
          }
        }
      />

      <fields.EmbeddedInstanceRequired<aas.types.Reference>
        label="Value id"
        helpUrl={
          `${help.ROOT_URL}/Value_reference_pair.html#property-value_id`
        }
        parent={props.instance}
        property="valueId"
        snapInstance={
          props.snapInstance.valueId
        }
        instance={
          props.instance.valueId
        }
        newInstanceDefinitions={
          newinstancing.FOR_REFERENCE
        }
        setInstance={
          (instance) => {
            props.instance.valueId = instance;
          }
        }
      />
    </>
  )
}

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//