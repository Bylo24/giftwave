
import { Card } from "@/components/ui/card";
import { Withdrawal } from "@/types/wallet";

interface TransactionsListProps {
  withdrawals: Withdrawal[];
}

export const TransactionsList = ({ withdrawals }: TransactionsListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <Card className="divide-y divide-gray-100 backdrop-blur-lg border border-gray-200/20 shadow-lg">
        {withdrawals.length > 0 ? (
          withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {withdrawal.method === 'paypal' ? 'PayPal' : 'Card'} Withdrawal
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-medium ${withdrawal.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                  -${withdrawal.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4">
            <p className="text-center text-gray-500">No recent transactions</p>
          </div>
        )}
      </Card>
    </div>
  );
};
