'use client';

import ReturnForm from '@/components/loans/ReturnForm';

export default function ReturnLoanPage({ params }: { params: { id: string } }) {
  return <ReturnForm loanId={params.id} />;
}