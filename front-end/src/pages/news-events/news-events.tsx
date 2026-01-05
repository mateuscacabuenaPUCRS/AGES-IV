import { Tabs } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getNews, deleteNews, updateNews, createNews, type NewsAPI } from "@/services/news";
import { getEvents, deleteEvent, updateEvent, createEvent, type EventAPI } from "@/services/events";
import {
  DeleteNewsEventModal,
  EditNewsEventModal,
  CreateNewsEventModal,
} from "@/components/news-events";
import {
  SearchHeader,
  EmptyState,
  LoadingState,
  NewsEventsList,
  type NewsEventItem,
} from "./components";
import { Pagination } from "@/components/ui/Pagination";
import { useUser } from "@/hooks/useUser";
import { ResolutionWarningModal } from "@/components/ui/ResolutionWarningModal";

const CARDS_PER_PAGE = 10;
const MIN_LOADING_TIME = 500;
const INITIAL_PAGE = 1;
const API_PAGE_SIZE = 100;

const TAB_INDEX = {
  NEWS: 0,
  EVENTS: 1,
  ALL: 2,
} as const;

export default function NewsEvents() {
  const [allItems, setAllItems] = useState<NewsEventItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<NewsEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [totalPages, setTotalPages] = useState(INITIAL_PAGE);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(TAB_INDEX.NEWS);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [searchParams] = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NewsEventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  // Verifica se o usuário é admin, redireciona se não for
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
    navigate("/");
  }
  }, [user, navigate]);

  useEffect(() => {
    setCurrentPage(INITIAL_PAGE);
  }, [searchParams, sortOrder, activeTabIndex]);

  useEffect(() => {
    const fetchAllData = async () => {
      const startTime = Date.now();

      try {
        setLoading(true);

        const [newsItems, eventItems] = await Promise.all([fetchNewsItems(), fetchEventItems()]);

        const combined = [...newsItems, ...eventItems];
        setAllItems(combined);

        await ensureMinimumLoadingTime(startTime);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchNewsItems = async (): Promise<NewsEventItem[]> => {
    try {
      const newsResponse = await getNews({
        page: INITIAL_PAGE,
        pageSize: API_PAGE_SIZE,
      });

      const newsData = newsResponse.data || [];

      if (Array.isArray(newsData) && newsData.length > 0) {
        return newsData.map((news) => ({
          id: news.id,
          title: news.title,
          date: new Date(news.date),
          type: "news" as const,
          originalData: news,
        }));
      }

      return [];
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      return [];
    }
  };

  const fetchEventItems = async (): Promise<NewsEventItem[]> => {
    try {
      const eventsResponse = await getEvents({
        page: INITIAL_PAGE,
        pageSize: API_PAGE_SIZE,
      });

      const eventsData = eventsResponse.data || [];

      if (Array.isArray(eventsData) && eventsData.length > 0) {
        return eventsData.map((event) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.dateStart),
          type: "event" as const,
          originalData: event,
        }));
      }

      return [];
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      return [];
    }
  };

  const ensureMinimumLoadingTime = async (startTime: number): Promise<void> => {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < MIN_LOADING_TIME) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
    }
  };

  useEffect(() => {
    const searchTerm = searchParams.get("search")?.toLowerCase() || "";

    let filtered = [...allItems];

    if (activeTabIndex === TAB_INDEX.NEWS) {
      filtered = filtered.filter((item) => item.type === "news");
    } else if (activeTabIndex === TAB_INDEX.EVENTS) {
      filtered = filtered.filter((item) => item.type === "event");
    }

    if (searchTerm) {
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchTerm));
    }

    filtered.sort((a, b) => {
      const multiplier = sortOrder === "recent" ? -1 : 1;
      return multiplier * (a.date.getTime() - b.date.getTime());
    });

    const totalPagesCalculated = Math.ceil(filtered.length / CARDS_PER_PAGE);
    setTotalPages(Math.max(INITIAL_PAGE, totalPagesCalculated));

    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const paginated = filtered.slice(startIndex, endIndex);

    setFilteredItems(paginated);
  }, [allItems, searchParams, activeTabIndex, sortOrder, currentPage]);

  const handleOpenDeleteModal = (item: NewsEventItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      setIsDeleting(true);
      if (selectedItem.type === "news") {
        await deleteNews(selectedItem.id);
      } else {
        await deleteEvent(selectedItem.id);
      }
      setIsDeleteModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert(
        `Erro ao excluir ${selectedItem.type === "news" ? "notícia" : "evento"}. Tente novamente.`
      );
      setIsDeleting(false);
    }
  };

  const handleOpenEditModal = (item: NewsEventItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSave = async (
    data:
      | {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          url: string;
        }
      | {
          id: string;
          title: string;
          description: string;
          dateStart: string;
          dateEnd: string;
          location: string;
          url: string;
        }
  ) => {
    if (!selectedItem) return;

    try {
      if (selectedItem.type === "news") {
        const { id, ...newsData } = data as {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          url: string;
        };
        await updateNews(id, newsData);
      } else {
        const { id, ...eventData } = data as {
          id: string;
          title: string;
          description: string;
          dateStart: string;
          dateEnd: string;
          location: string;
          url: string;
        };
        await updateEvent(id, eventData);
      }
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(
        `Erro ao salvar ${selectedItem.type === "news" ? "notícia" : "evento"}:`,
        error
      );
      alert(
        `Erro ao salvar ${selectedItem.type === "news" ? "notícia" : "evento"}. Tente novamente.`
      );
    }
  };

  const handleDeleteRequestFromEditModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async (
    type: "news" | "event",
    data:
      | { title: string; description: string; date: string; location: string; url: string }
      | {
          title: string;
          description: string;
          dateStart: string;
          dateEnd: string;
          location: string;
          url: string;
        }
  ) => {
    try {
      if (type === "news") {
        await createNews(
          data as {
            title: string;
            description: string;
            date: string;
            location: string;
            url: string;
          }
        );
      } else {
        await createEvent(
          data as {
            title: string;
            description: string;
            dateStart: string;
            dateEnd: string;
            location: string;
            url: string;
          }
        );
      }
      setIsCreateModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(`Erro ao criar ${type === "news" ? "notícia" : "evento"}:`, error);
      alert(`Erro ao criar ${type === "news" ? "notícia" : "evento"}. Tente novamente.`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "recent" ? "oldest" : "recent");
  };

  const getEmptyStateMessage = (): string => {
    if (activeTabIndex === TAB_INDEX.NEWS) return "notícia";
    if (activeTabIndex === TAB_INDEX.EVENTS) return "evento";
    return "item";
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState count={CARDS_PER_PAGE} />;
    }

    if (filteredItems.length === 0) {
      return <EmptyState message={getEmptyStateMessage()} />;
    }

    return (
      <NewsEventsList
        items={filteredItems}
        onDelete={handleOpenDeleteModal}
        onEdit={handleOpenEditModal}
      />
    );
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8 bg-[#2F5361]">
      <ResolutionWarningModal minWidth={1024} />
      <div className="w-full flex flex-col">
        <Tabs
          tabs={["Notícias", "Eventos", "Todos"]}
          variant="secondary"
          headerContent={
            <SearchHeader
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onCreateClick={() => setIsCreateModalOpen(true)}
            />
          }
          onTabChange={(_, index) => {
            setActiveTabIndex(index);
            setCurrentPage(INITIAL_PAGE);
          }}
        >
          {renderContent()}
          {renderContent()}
          {renderContent()}
        </Tabs>
      </div>

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <CreateNewsEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={handleCreate}
      />

      {selectedItem && (
        <>
          <DeleteNewsEventModal
            open={isDeleteModalOpen && !isDeleting}
            onOpenChange={setIsDeleteModalOpen}
            onConfirm={handleConfirmDelete}
            itemTitle={selectedItem.title}
            itemType={selectedItem.type}
          />

          {selectedItem.type === "news" ? (
            <EditNewsEventModal
              type="news"
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
              data={selectedItem.originalData as NewsAPI}
              onSave={handleSave}
              onDeleteRequest={handleDeleteRequestFromEditModal}
            />
          ) : (
            <EditNewsEventModal
              type="event"
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
              data={selectedItem.originalData as EventAPI}
              onSave={handleSave}
              onDeleteRequest={handleDeleteRequestFromEditModal}
            />
          )}
        </>
      )}
    </div>
  );
}
