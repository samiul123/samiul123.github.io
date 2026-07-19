import { experiences } from '../constants';
import Timeline from './Timeline';

const parseRangeStart = (date) => {
  const start = date.split(' - ')[0].trim();
  return start.toLowerCase() === 'present' ? Date.now() : new Date(start).getTime();
};

export const Experience = (props) => {
  const items = [...experiences]
    .sort((a, b) => parseRangeStart(b.date) - parseRangeStart(a.date))
    .map(exp => ({
      title: exp.title,
      subtitle: exp.company,
      date: exp.date,
      images: exp.images,
    }));

  return (
    <div id={props.id}>
      <Timeline items={items} label="Career" title="EXPERIENCE" />
    </div>
  );
};
