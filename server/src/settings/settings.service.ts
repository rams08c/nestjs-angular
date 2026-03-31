import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

export interface SettingsResponse {
  firstName: string | null;
  lastName: string | null;
  profilePic: string | null;
  location: string | null;
  address: string | null;
  country: string | null;
}

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string): Promise<SettingsResponse> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    return this.toResponse(profile);
  }

  async update(userId: string, dto: UpdateSettingsDto): Promise<SettingsResponse> {
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        firstName: dto.firstName?.trim() ?? null,
        lastName: dto.lastName?.trim() ?? null,
        profilePic: dto.profilePic ?? null,
        location: dto.location?.trim() ?? null,
        address: dto.address?.trim() ?? null,
        country: dto.country?.trim() ?? null,
      },
      update: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName.trim() }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName.trim() }),
        ...(dto.profilePic !== undefined && { profilePic: dto.profilePic }),
        ...(dto.location !== undefined && { location: dto.location.trim() }),
        ...(dto.address !== undefined && { address: dto.address.trim() }),
        ...(dto.country !== undefined && { country: dto.country.trim() }),
      },
    });
    return this.toResponse(profile);
  }

  private toResponse(
    profile: {
      firstName: string | null;
      lastName: string | null;
      profilePic: string | null;
      location: string | null;
      address: string | null;
      country: string | null;
    } | null,
  ): SettingsResponse {
    return {
      firstName: profile?.firstName ?? null,
      lastName: profile?.lastName ?? null,
      profilePic: profile?.profilePic ?? null,
      location: profile?.location ?? null,
      address: profile?.address ?? null,
      country: profile?.country ?? null,
    };
  }
}
