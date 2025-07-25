'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkshopsList from './_components/WorkshopsList';
import { useAppSelector, useAppDispatch } from '../hooks';
import { useEffect, useMemo, useState } from 'react';
import ListHeader from '@/components/ListHeader';
import { fetchWorkshops } from '../admin/workshops/workshopSlice';

export default function WorkshopsPage() {
  const { workshops } = useAppSelector((state) => state.workshops);
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const categories = ['Tech', 'Design', 'Marketing'];

  // Filter workshops based on search and category
  const filteredWorkshops = useMemo(() => {
    return workshops.filter((workshop) => {
      const matchesSearch = search
        ? workshop.title.toLowerCase().includes(search.toLowerCase()) ||
          workshop.description?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory =
        !category ||
        workshop.category === category ||
        category?.toLocaleLowerCase() === 'all'
          ? true
          : false;

      return matchesSearch && matchesCategory;
    });
  }, [workshops, search, category]);

  useEffect(() => {
    dispatch(fetchWorkshops());
  }, [dispatch]);

  return (
    <>
      {/* <h1 className='text-3xl font-bold mb-6'>Workshops</h1> */}
      <ListHeader
        showAdd={false}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
        }}
        searchPlaceholder='Search...'
        showSearch={true}
        filterValue={category}
        onFilterChange={(val) => {
          setCategory(val);
        }}
        filterOptions={categories}
        showFilter={true}
        showRefresh={false}
        disabled={false}
      />
      <Tabs defaultValue='list' className='w-full'>
        {/* <TabsList>
          <TabsTrigger value='list'>List View</TabsTrigger> */}
        {/* <TabsTrigger value='calendar'>Calendar View</TabsTrigger> */}
        {/* </TabsList> */}
        <TabsContent value='list'>
          <WorkshopsList workshops={filteredWorkshops} />
        </TabsContent>
        {/* <TabsContent value='calendar'>
          <WorkshopsCalendar workshops={filteredWorkshops} />
        </TabsContent> */}
      </Tabs>
    </>
    // </main>
  );
}
