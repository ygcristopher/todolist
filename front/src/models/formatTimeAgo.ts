import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale'; 

const timeAgo = (timestamp: string) => {
  const createdAt = new Date(timestamp);
  return formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR });
};

export default timeAgo;