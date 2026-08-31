import { defineStore } from 'pinia';
import eventsService, {
  EventModel,
  EventAttendeeModel
} from '../services/events.service';
import { useAuthStore } from './auth';

export const useEventsStore = defineStore('events', {
  state: () => ({
    eventsList: [] as EventModel[],
    activeEvent: null as EventModel | null,
    activeAttendees: [] as EventAttendeeModel[],
    hasConfirmedRSVP: false,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async fetchEvents() {
      this.isLoading = true;
      this.error = null;

      try {
        const defaultEventIds = [1, 2, 3];
        const loaded: EventModel[] = [];

        for (const id of defaultEventIds) {
          const ev = await eventsService.getEvent(id);
          if (ev) loaded.push(ev);
        }

        if (loaded.length === 0) {
          this.eventsList = [
            {
              id: 1,
              title: 'Workix Tech Summit 2026: GraphQL, Vue 3 & Inteligência Artificial',
              description: 'O maior encontro anual de engenharia de software da comunidade Workix com palestras, workshops e networking com recrutadores.',
              eventType: 'ONLINE',
              startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
              locationOrUrl: 'https://meet.workix.com.br/tech-summit-2026',
              organizerId: 1
            },
            {
              id: 2,
              title: 'Meetup Presencial: Arquitetura Android Nativa & Kotlin Coroutines',
              description: 'Encontro presencial em São Paulo com foco em boas práticas de engenharia mobile, testes e Clean Architecture.',
              eventType: 'IN_PERSON',
              startTime: new Date(Date.now() + 86400000 * 7).toISOString(),
              locationOrUrl: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
              organizerId: 2
            },
            {
              id: 3,
              title: 'Workshop de Carreira: Como Otimizar seu Perfil & Social Selling Index',
              description: 'Sessão prática com especialistas em RH sobre como atrair conexões de alto valor e oportunidades no ecossistema.',
              eventType: 'ONLINE',
              startTime: new Date(Date.now() + 86400000 * 10).toISOString(),
              locationOrUrl: 'https://meet.workix.com.br/workshop-carreira',
              organizerId: 1
            }
          ];
        } else {
          this.eventsList = loaded;
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar eventos.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEventDetails(id: string | number) {
      this.isLoading = true;
      this.error = null;
      this.hasConfirmedRSVP = false;

      try {
        const ev = await eventsService.getEvent(id);
        if (ev) {
          this.activeEvent = ev;
        } else {
          this.activeEvent = this.eventsList.find((e) => String(e.id) === String(id)) || {
            id,
            title: `Evento Profissional #${id}`,
            description: 'Encontro técnico e de networking promovido pela comunidade Workix.',
            eventType: 'ONLINE',
            startTime: new Date().toISOString(),
            locationOrUrl: 'https://meet.workix.com.br',
            organizerId: 1
          };
        }

        const attendees = await eventsService.getEventAttendees(id);
        this.activeAttendees = attendees;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar detalhes do evento.';
      } finally {
        this.isLoading = false;
      }
    },

    async createEvent(
      title: string,
      description: string,
      eventType = 'ONLINE',
      startTime?: string,
      endTime?: string,
      locationOrUrl?: string
    ) {
      const authStore = useAuthStore();
      const organizerId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const created = await eventsService.createEvent(
          organizerId,
          title,
          description,
          eventType,
          startTime,
          endTime,
          locationOrUrl
        );

        if (created) {
          this.eventsList.unshift(created);
          return created;
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao criar evento.';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async rsvpEvent(eventId: string | number) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id || 1;

      try {
        const attendee = await eventsService.attendEvent(eventId, userId, 'ATTENDING');
        this.hasConfirmedRSVP = true;
        if (attendee) {
          this.activeAttendees.push(attendee);
        }
        return attendee;
      } catch (err: any) {
        this.error = err.message || 'Erro ao confirmar presença.';
        throw err;
      }
    }
  }
});

export default useEventsStore;
