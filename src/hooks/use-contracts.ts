'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { contractsService } from '@/services';
import { queryKeys, ROUTES } from '@/constants';
import type { CreateContractRequest } from '@/types';

export function useContracts() {
  return useQuery({
    queryKey: queryKeys.contracts.all,
    queryFn: () => contractsService.findAll(),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: queryKeys.contracts.detail(id),
    queryFn: () => contractsService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateContractRequest) => contractsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.all });
      qc.invalidateQueries({ queryKey: ['rooms'] }); // room status changed
      toast.success('Tạo hợp đồng thành công');
      router.push(ROUTES.CONTRACTS);
    },
    onError: () => toast.error('Tạo hợp đồng thất bại'),
  });
}

export function useTerminateContract() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsService.terminate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.all });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.detail(id) });
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Thanh lý hợp đồng thành công');
    },
    onError: () => toast.error('Thanh lý hợp đồng thất bại'),
  });
}
