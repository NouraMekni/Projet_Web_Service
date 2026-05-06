import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IncidentService } from './incident.service';
import { Incident } from './entities/incident.entity';
import { IncidentType, IncidentStatus } from './entities/incident.entity';

@Resolver(() => Incident)
export class IncidentResolver {
  constructor(private incidentService: IncidentService) {}

  @Mutation(() => Incident)
  async createIncident(
    @Args('title') title: string,
    @Args('type', { type: () => IncidentType }) type: IncidentType,
    @Args('reportedById', { type: () => Int }) reportedById: number,
    @Args('vehicleId', { type: () => Int, nullable: true }) vehicleId?: number,
    @Args('latitude', { nullable: true }) latitude?: number,
    @Args('longitude', { nullable: true }) longitude?: number,
    @Args('description', { nullable: true }) description?: string,
  ) {
    console.log('Creating incident with:', {
      title,
      type,
      reportedById,
      vehicleId,
      latitude,
      longitude,
      description,
    });

    return this.incidentService.create({
      title,
      type,
      latitude,
      longitude,
      description,
      reportedById,
      vehicleId,
    });
  }

  @Query(() => [Incident])
  async incidents() {
    const incidents = await this.incidentService.findAll();
    console.log(`Found ${incidents.length} incidents`);
    return incidents;
  }

  @Mutation(() => Incident)
  async updateIncidentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => IncidentStatus }) status: IncidentStatus,
  ) {
    return this.incidentService.updateStatus(id, status);
  }
}
