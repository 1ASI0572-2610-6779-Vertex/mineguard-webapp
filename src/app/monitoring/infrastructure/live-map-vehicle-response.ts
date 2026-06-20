import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { VehicleOperationalStatus } from '../domain/model/vehicle-operational-status';

/**
 * @interface LiveMapVehicleResource
 * @description
 * Representa el Data Transfer Object (DTO) o recurso de un vehículo individual
 * devuelto por la API para su visualización en el mapa en tiempo real.
 *
 * Extiende de `BaseResource` para heredar las propiedades base de cualquier recurso
 * manejado por el sistema.
 *
 * @extends {BaseResource}
 */
export interface LiveMapVehicleResource extends BaseResource {
  /**
   * @property {number} id
   * Identificador único del vehículo en la base de datos.
   */
  id: number;

  /**
   * @property {string} code
   * Código alfanumérico interno, identificador de flota o matrícula del vehículo.
   */
  code: string;

  /**
   * @property {string} vehicleType
   * Categoría o tipo de vehículo (ej. Camión minero, Excavadora, Camioneta de supervisión).
   */
  vehicleType: string;

  /**
   * @property {number} latitude
   * Coordenada GPS de latitud actual del vehículo para su geolocalización en el mapa.
   */
  latitude: number;

  /**
   * @property {number} longitude
   * Coordenada GPS de longitud actual del vehículo para su geolocalización en el mapa.
   */
  longitude: number;

  /**
   * @property {VehicleOperationalStatus} status
   * Estado operativo actual del vehículo (ej. Activo, En Mantenimiento, Fuera de Servicio).
   * Utiliza el tipo de dominio para garantizar la consistencia en toda la aplicación.
   */
  status: VehicleOperationalStatus;

  /**
   * @property {string} driverName
   * Nombre completo del operador o conductor asignado actualmente al vehículo.
   */
  driverName: string;

  /**
   * @property {number | null} activeTripId
   * ID del viaje activo asignado a este vehículo. Null si el vehículo no tiene
   * un viaje activo en curso. Requerido por GET /api/v1/trips/{tripId}/cardiac-readings.
   */
  activeTripId: number | null;
}

/**
 * @interface LiveMapVehiclesResponse
 * @description
 * Representa la estructura de la respuesta HTTP completa al consultar el listado de
 * vehículos para el mapa en tiempo real.
 *
 * Extiende de `BaseResponse` para heredar la metadata de paginación, estado de la
 * petición u otros datos base que envíe el servidor.
 *
 * @extends {BaseResponse}
 */
export interface LiveMapVehiclesResponse extends BaseResponse {}
