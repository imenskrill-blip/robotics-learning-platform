import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  async create(createOrgDto: CreateOrganizationDto, ownerId: number) {
    const existingOrg = await this.organizationsRepository.findOne({
      where: { slug: createOrgDto.slug },
    });

    if (existingOrg) {
      throw new BadRequestException('Organization slug already exists');
    }

    const organization = this.organizationsRepository.create({
      ...createOrgDto,
      ownerId,
    });

    return await this.organizationsRepository.save(organization);
  }

  async findAll() {
    return await this.organizationsRepository.find({
      where: { isActive: true },
      relations: ['users', 'courses'],
    });
  }

  async findById(id: number) {
    const org = await this.organizationsRepository.findOne({
      where: { id },
      relations: ['users', 'courses', 'subscriptions'],
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async findBySlug(slug: string) {
    const org = await this.organizationsRepository.findOne({
      where: { slug },
      relations: ['users', 'courses'],
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async update(id: number, updateOrgDto: UpdateOrganizationDto) {
    const org = await this.findById(id);

    Object.assign(org, updateOrgDto);

    return await this.organizationsRepository.save(org);
  }

  async delete(id: number) {
    const org = await this.findById(id);
    org.isActive = false;
    return await this.organizationsRepository.save(org);
  }
}
