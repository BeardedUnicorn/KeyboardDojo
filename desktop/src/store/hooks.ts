import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@store/index';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
