import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';

import ApprovalFilter from './ApprovalFilter';
import ApprovalRulesPanel from './ApprovalRulesPanel';
import ApprovalStats from './ApprovalStats';
import BulkApprovalPanel from './BulkApprovalPanel';
import ExpenseCard from './ExpenseCard';
import ReceiptViewer from './ReceiptViewer';

const ManagerApprovalQueue = () => {
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('manager_approval_queue')
        .select('*');

      if (error) {
        console.error(error);
        setError('Failed to fetch approval queue');
      } else {
        setQueue(data || []); // always an array
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong fetching queue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  if (isLoading) {
    return <div className="text-center p-6">Loading manager approval queue...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-error">{error}</div>;
  }

  if (queue.length === 0) {
    return <div className="text-center p-6 text-muted">No users pending approval.</div>;
  }

  return (
    <div className="space-y-6">
      <ApprovalStats queue={queue} />
      <ApprovalFilter queue={queue} setQueue={setQueue} />
      <BulkApprovalPanel queue={queue} setQueue={setQueue} />
      {queue.map((item) => (
        <ExpenseCard key={item.id} expense={item} />
      ))}
      <ReceiptViewer queue={queue} />
      <ApprovalRulesPanel queue={queue} />
    </div>
  );
};

export default ManagerApprovalQueue;
