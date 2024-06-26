interface ListWrapperProps {
  children: React.ReactNode
}

export const ListWrapper = ({ children }: ListWrapperProps) => {
  return <li className='shrink-0 w-[272px] select-none h-full'>{children}</li>
}
