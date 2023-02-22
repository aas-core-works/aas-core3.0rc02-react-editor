//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.AdministrativeInformation|AdministrativeInformation}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as help from './help.generated';
import * as newinstancing from '../../newinstancing.generated';

export function AdministrativeInformationFields(
  props: {
    snapInstance: Readonly<aas.types.AdministrativeInformation>,
    instance: aas.types.AdministrativeInformation,
  }
) {
  return (
    <>
      <fields.ListFieldOptional<aas.types.EmbeddedDataSpecification>
        label="Embedded data specifications"
        helpUrl={
          `${help.ROOT_URL}/Administrative_information.html#property-embedded_data_specifications`
        }
        parent={props.instance}
        property="embeddedDataSpecifications"
        newInstanceDefinitions={
          newinstancing.FOR_EMBEDDED_DATA_SPECIFICATION
        }
        snapItems={
          props.snapInstance.embeddedDataSpecifications
        }
        items={
          props.instance.embeddedDataSpecifications
        }
        setItems={
          (items) => {
            props.instance.embeddedDataSpecifications = items;
          }
        }
      />

      <fields.TextFieldOptional
        label="Version"
        helpUrl={
          `${help.ROOT_URL}/Administrative_information.html#property-version`
        }
        value={props.snapInstance.version}
        onChange={
          (value) => {
            props.instance.version = value;
          }
        }
      />

      <fields.TextFieldOptional
        label="Revision"
        helpUrl={
          `${help.ROOT_URL}/Administrative_information.html#property-revision`
        }
        value={props.snapInstance.revision}
        onChange={
          (value) => {
            props.instance.revision = value;
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