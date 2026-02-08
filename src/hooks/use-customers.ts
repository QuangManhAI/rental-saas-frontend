import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customersService, type Customer, type CreateCustomerDto, type UpdateCustomerDto } from '@/services';
import { queryKeys } from '@/constants';

export const useCustomers = () => {
  return useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: () => customersService.getAll(),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      customersService.update(id, data),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(updatedCustomer._id),
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};

export const useCustomerTelegramLink = () => {
  return useMutation({
    mutationFn: (id: string) => customersService.getTelegramLink(id),
  });
};