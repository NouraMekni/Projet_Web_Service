import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IncidentService } from './incident.service';
import { Incident } from '../incident/entities/incident.entity';
import { IncidentType, IncidentStatus } from './entities/incident.entity';
@Resolver(() => Incident)
export class IncidentResolver {
  constructor(private incidentService: IncidentService) {}

  @Mutation(() => Incident)
  async createIncident(
    @Args('title') title: string,
    @Args('type', { type: () => IncidentType }) type: IncidentType,
    @Args('latitude', { nullable: true }) latitude?: number,
    @Args('longitude', { nullable: true }) longitude?: number,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return this.incidentService.create({
      title,
      type,
      latitude,
      longitude,
      description,
    });
  }

  @Query(() => [Incident])
  async incidents() {
    return this.incidentService.findAll();
  }

  @Mutation(() => Incident)
  async updateIncidentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => IncidentStatus })
    status: IncidentStatus,
  ) {
    return this.incidentService.updateStatus(id, status);
  }
}
