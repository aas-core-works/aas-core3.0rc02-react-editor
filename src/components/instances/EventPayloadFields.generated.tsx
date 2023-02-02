//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.EventPayload|EventPayload}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as newinstancing from '../../newinstancing.generated';
import * as help from './help.generated';

export function EventPayloadFields(
  props: {
    snapInstance: Readonly<aas.types.EventPayload>,
    instance: aas.types.EventPayload,
  }
) {
  return (
    <>
      <fields.EmbeddedInstanceRequired<aas.types.Reference>
        label="Source"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-source`
        }
        snapInstance={
          props.snapInstance.source
        }
        instance={
          props.instance.source
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
        }
        setInstance={
          (instance) => {
            props.instance.source = instance;
          }
        }
      />

      <fields.EmbeddedInstanceOptional<aas.types.Reference>
        label="Source semantic id"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-source_semantic_id`
        }
        snapInstance={
          props.snapInstance.sourceSemanticId
        }
        instance={
          props.instance.sourceSemanticId
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
        }
        setInstance={
          (instance) => {
            props.instance.sourceSemanticId = instance;
          }
        }
      />

      <fields.EmbeddedInstanceRequired<aas.types.Reference>
        label="Observable reference"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-observable_reference`
        }
        snapInstance={
          props.snapInstance.observableReference
        }
        instance={
          props.instance.observableReference
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
        }
        setInstance={
          (instance) => {
            props.instance.observableReference = instance;
          }
        }
      />

      <fields.EmbeddedInstanceOptional<aas.types.Reference>
        label="Observable semantic id"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-observable_semantic_id`
        }
        snapInstance={
          props.snapInstance.observableSemanticId
        }
        instance={
          props.instance.observableSemanticId
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
        }
        setInstance={
          (instance) => {
            props.instance.observableSemanticId = instance;
          }
        }
      />

      <fields.TextFieldOptional
        label="Topic"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-topic`
        }
        value={props.snapInstance.topic}
        onChange={
          (value) => {
            props.instance.topic = value;
          }
        }
      />

      <fields.EmbeddedInstanceOptional<aas.types.Reference>
        label="Subject id"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-subject_id`
        }
        snapInstance={
          props.snapInstance.subjectId
        }
        instance={
          props.instance.subjectId
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
        }
        setInstance={
          (instance) => {
            props.instance.subjectId = instance;
          }
        }
      />

      <fields.TextFieldRequired
        label="Time stamp"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-time_stamp`
        }
        value={props.snapInstance.timeStamp}
        onChange={
          (value) => {
            props.instance.timeStamp = value;
          }
        }
      />

      <fields.TextFieldOptional
        label="Payload"
        helpUrl={
          `${help.ROOT_URL}/Event_payload.html#property-payload`
        }
        value={props.snapInstance.payload}
        onChange={
          (value) => {
            props.instance.payload = value;
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
