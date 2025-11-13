import { getCountdown } from '@/sanity/sanity-shop-utils';
import CountdownBanner from './CountdownBanner';

const CountDown = async () => {
  const countdown = await getCountdown();

  return <div>{countdown && <CountdownBanner data={countdown} />}</div>;
};

export default CountDown;
