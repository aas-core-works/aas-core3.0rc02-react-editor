/**
 * Define how titles are to be produced for instances of AAS classes.
 */

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";

/* eslint-disable @typescript-eslint/no-unused-vars */

class Titler extends aas.types.AbstractTransformer<string> {
  transformExtension(that: aas.types.Extension): string {
    return "Extension";
  }

  transformAdministrativeInformation(
    that: aas.types.AdministrativeInformation
  ): string {
    return "Administrative information";
  }

  transformQualifier(that: aas.types.Qualifier): string {
    return "Qualifier";
  }

  transformAssetAdministrationShell(
    that: aas.types.AssetAdministrationShell
  ): string {
    return `Asset administration shell ${that.id}`;
  }

  transformAssetInformation(that: aas.types.AssetInformation): string {
    return "Asset information";
  }

  transformResource(that: aas.types.Resource): string {
    return "Resource";
  }

  transformSpecificAssetId(that: aas.types.SpecificAssetId): string {
    return "Specific asset id";
  }

  transformSubmodel(that: aas.types.Submodel): string {
    return `Submodel ${that.id}`;
  }

  transformRelationshipElement(that: aas.types.RelationshipElement): string {
    return that.idShort !== null
      ? `Relationship element ${that.idShort}`
      : "Relationship element";
  }

  transformSubmodelElementList(that: aas.types.SubmodelElementList): string {
    return that.idShort !== null
      ? `Submodel element list ${that.idShort}`
      : "Submodel element list";
  }

  transformSubmodelElementCollection(
    that: aas.types.SubmodelElementCollection
  ): string {
    return that.idShort !== null
      ? `Submodel element collection ${that.idShort}`
      : "Submodel element collection";
  }

  transformProperty(that: aas.types.Property): string {
    return that.idShort !== null ? `Property ${that.idShort}` : "Property";
  }

  transformMultiLanguageProperty(
    that: aas.types.MultiLanguageProperty
  ): string {
    return that.idShort !== null
      ? `Multi language property ${that.idShort}`
      : "Multi language property";
  }

  transformRange(that: aas.types.Range): string {
    return that.idShort !== null ? `Range ${that.idShort}` : "Range";
  }

  transformReferenceElement(that: aas.types.ReferenceElement): string {
    return that.idShort !== null
      ? `Reference element ${that.idShort}`
      : "Reference element";
  }

  transformBlob(that: aas.types.Blob): string {
    return that.idShort !== null ? `Blob ${that.idShort}` : "Blob";
  }

  transformFile(that: aas.types.File): string {
    return that.idShort !== null ? `File ${that.idShort}` : "File";
  }

  transformAnnotatedRelationshipElement(
    that: aas.types.AnnotatedRelationshipElement
  ): string {
    return that.idShort !== null
      ? `Annotated relationship element ${that.idShort}`
      : "Annotated relationship element";
  }

  transformEntity(that: aas.types.Entity): string {
    return that.idShort !== null ? `Entity ${that.idShort}` : "Entity";
  }

  transformEventPayload(that: aas.types.EventPayload): string {
    return "Event payload";
  }

  transformBasicEventElement(that: aas.types.BasicEventElement): string {
    return that.idShort !== null
      ? `Basic event element ${that.idShort}`
      : "Basic event element";
  }

  transformOperation(that: aas.types.Operation): string {
    return that.idShort !== null ? `Operation ${that.idShort}` : "Operation";
  }

  transformOperationVariable(that: aas.types.OperationVariable): string {
    return "Operation variable";
  }

  transformCapability(that: aas.types.Capability): string {
    return that.idShort !== null ? `Capability ${that.idShort}` : "Capability";
  }

  transformConceptDescription(that: aas.types.ConceptDescription): string {
    return `Concept description ${that.id}`;
  }

  transformReference(that: aas.types.Reference): string {
    return "Reference";
  }

  transformKey(that: aas.types.Key): string {
    return "Key";
  }

  transformLangString(that: aas.types.LangString): string {
    return "Lang string";
  }

  transformEnvironment(that: aas.types.Environment): string {
    return "Environment";
  }

  transformEmbeddedDataSpecification(
    that: aas.types.EmbeddedDataSpecification
  ): string {
    return "Embedded data specification";
  }

  transformValueReferencePair(that: aas.types.ValueReferencePair): string {
    return "Value reference pair";
  }

  transformValueList(that: aas.types.ValueList): string {
    return "Value list";
  }

  transformDataSpecificationIec61360(
    that: aas.types.DataSpecificationIec61360
  ): string {
    return "Data specification IEC 61360";
  }

  transformDataSpecificationPhysicalUnit(
    that: aas.types.DataSpecificationPhysicalUnit
  ): string {
    return "Data specification physical unit";
  }
}

const TITLER = new Titler();

export function getTitle(instance: aas.types.Class): string {
  return TITLER.transform(instance);
}

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//
