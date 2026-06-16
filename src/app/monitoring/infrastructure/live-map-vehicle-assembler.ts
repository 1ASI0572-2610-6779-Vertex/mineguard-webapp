import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { LiveMapVehicle } from '../domain/model/live-map-vehicle.entity';
import { LiveMapVehicleResource, LiveMapVehiclesResponse } from './live-map-vehicle-response';

/**
 * @class LiveMapVehicleAssembler
 * @description
 * Implementa el patrón Assembler (o Data Mapper) para la capa de infraestructura del mapa en tiempo real.
 *
 * Su responsabilidad exclusiva es transformar los objetos de transferencia de datos (DTOs o Recursos)
 * recibidos de la API externa en entidades de dominio enriquecidas, y viceversa. Esto aísla la lógica
 * central del sistema de monitoreo de cualquier cambio en la estructura de los datos de red.
 *
 * @implements {BaseAssembler<LiveMapVehicle, LiveMapVehicleResource, LiveMapVehiclesResponse>}
 */
export class LiveMapVehicleAssembler
  implements BaseAssembler<LiveMapVehicle, LiveMapVehicleResource, LiveMapVehiclesResponse>
{
  /**
   * @method toEntityFromResource
   * @description
   * Transforma un recurso individual proveniente de la API (DTO) en una instancia válida
   * de la entidad de dominio `LiveMapVehicle`.
   *
   * @param {LiveMapVehicleResource} resource - Los datos planos del vehículo recibidos del backend.
   * @returns {LiveMapVehicle} Una instancia del modelo de dominio lista para aplicar lógica de negocio
   * o ser representada en el mapa de operaciones.
   */
  toEntityFromResource(resource: LiveMapVehicleResource): LiveMapVehicle {
    return new LiveMapVehicle({
      id: resource.id,
      code: resource.code,
      vehicleType: resource.vehicleType,
      latitude: resource.latitude,
      longitude: resource.longitude,
      status: resource.status,
      driverName: resource.driverName,
    });
  }

  /**
   * @method toResourceFromEntity
   * @description
   * Convierte una entidad de dominio `LiveMapVehicle` de vuelta a un objeto plano (Resource/DTO).
   * Esto es útil cuando se necesita enviar el estado actualizado de un vehículo de vuelta al
   * servidor o cuando se requiere almacenar los datos en un estado global serializable (como NgRx/Redux).
   *
   * @param {LiveMapVehicle} entity - La instancia de la entidad de dominio con los datos actuales.
   * @returns {LiveMapVehicleResource} Un objeto plano serializable.
   */
  toResourceFromEntity(entity: LiveMapVehicle): LiveMapVehicleResource {
    return {
      id: entity.id,
      code: entity.code,
      vehicleType: entity.vehicleType,
      latitude: entity.latitude,
      longitude: entity.longitude,
      status: entity.status,
      driverName: entity.driverName,
    };
  }

  /**
   * @method toEntitiesFromResponse
   * @description
   * Procesa la respuesta HTTP completa del endpoint de vehículos y extrae la lista de recursos,
   * transformando cada uno de ellos en su respectiva entidad de dominio mediante `toEntityFromResource`.
   *
   * Emplea el operador de coalescencia nula (`?? []`) como mecanismo de seguridad para garantizar
   * que la iteración no arroje errores si el backend devuelve una respuesta sin el arreglo `vehicles`.
   *
   * @param {LiveMapVehiclesResponse} response - La respuesta completa HTTP con la lista de vehículos.
   * @returns {LiveMapVehicle[]} Un arreglo de entidades de dominio listas para ser renderizadas.
   */
  toEntitiesFromResponse(_: LiveMapVehiclesResponse): LiveMapVehicle[] {
    return [];
  }
}
