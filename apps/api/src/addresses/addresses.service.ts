import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import type {
  AddressCreateInput,
  AddressReturnType,
  AddressUpdateInput,
} from '@repo/contracts'
import { ADDRESS_REPOSITORY, AddressType } from './constants'
import { Address } from './address.entity'

@Injectable()
export class AddressesService {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async list(userId: number): Promise<AddressReturnType[]> {
    const addresses = await this.addressRepo.find({
      where: { userId },
      order: { isDefault: 'DESC', id: 'DESC' },
    })
    return addresses.map((a) => this.toReturn(a))
  }

  async getOwnedEntity(userId: number, id: number): Promise<Address> {
    return this.findOwned(userId, id)
  }

  async create(
    userId: number,
    input: AddressCreateInput,
  ): Promise<AddressReturnType> {
    const type = this.toEntityType(input.type) ?? AddressType.SHIPPING
    const existingCount = await this.addressRepo.count({
      where: { userId, type },
    })
    const shouldDefault = input.isDefault === true || existingCount === 0

    if (shouldDefault) {
      await this.clearDefault(userId, type)
    }

    const address = this.addressRepo.create({
      userId,
      recipientName: input.recipientName,
      email: input.email,
      phone: input.phone,
      line1: input.line1,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      country: input.country,
      type,
      isDefault: shouldDefault,
    })
    const saved = await this.addressRepo.save(address)
    return this.toReturn(saved)
  }

  async update(
    userId: number,
    id: number,
    input: AddressUpdateInput,
  ): Promise<AddressReturnType> {
    const address = await this.findOwned(userId, id)
    const nextType = this.toEntityType(input.type) ?? address.type

    if (input.isDefault === true) {
      await this.clearDefault(userId, nextType)
      address.isDefault = true
    } else if (input.isDefault === false && address.isDefault) {
      address.isDefault = false
    }

    if (input.recipientName != null) address.recipientName = input.recipientName
    if (input.email != null) address.email = input.email
    if (input.phone != null) address.phone = input.phone
    if (input.line1 != null) address.line1 = input.line1
    if (input.city != null) address.city = input.city
    if (input.state != null) address.state = input.state
    if (input.zipCode != null) address.zipCode = input.zipCode
    if (input.country != null) address.country = input.country
    if (input.type != null) address.type = nextType

    const saved = await this.addressRepo.save(address)
    return this.toReturn(saved)
  }

  async setDefault(userId: number, id: number): Promise<AddressReturnType> {
    const address = await this.findOwned(userId, id)
    await this.clearDefault(userId, address.type)
    address.isDefault = true
    const saved = await this.addressRepo.save(address)
    return this.toReturn(saved)
  }

  async remove(userId: number, id: number): Promise<AddressReturnType> {
    const address = await this.findOwned(userId, id)
    const snapshot = this.toReturn(address)
    await this.addressRepo.softRemove(address)

    if (snapshot.isDefault) {
      const next = await this.addressRepo.findOne({
        where: { userId, type: address.type },
        order: { id: 'DESC' },
      })
      if (next) {
        next.isDefault = true
        await this.addressRepo.save(next)
      }
    }

    return snapshot
  }

  private async findOwned(userId: number, id: number): Promise<Address> {
    const address = await this.addressRepo.findOne({ where: { id, userId } })
    if (!address) {
      throw new NotFoundException('Address not found')
    }
    return address
  }

  private async clearDefault(userId: number, type: AddressType) {
    await this.addressRepo.update(
      { userId, type, isDefault: true },
      { isDefault: false },
    )
  }

  private toEntityType(
    type: AddressCreateInput['type'] | undefined,
  ): AddressType | undefined {
    if (type == null) return undefined
    return type === 'billing' ? AddressType.BILLING : AddressType.SHIPPING
  }

  private toReturn(address: Address): AddressReturnType {
    return {
      id: address.id,
      recipientName: address.recipientName,
      email: address.email,
      phone: address.phone,
      line1: address.line1,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      type: address.type,
      isDefault: address.isDefault,
      createdAt: address.createdAt.toISOString(),
      updatedAt: address.updatedAt.toISOString(),
    }
  }
}
