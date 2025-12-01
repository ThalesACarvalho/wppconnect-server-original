/*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { default as FormData } from 'form-data';
import mime from 'mime-types';

import bufferutils from './bufferutils';
// import bufferUtils from './bufferutils';
import { eventEmitter } from './sessionUtil';

export default class chatWootClient {
  declare config: any;
  declare session: any;
  declare mobile_name: any;
  declare mobile_number: any;
  declare sender: any;
  declare account_id: any;
  declare inbox_id: any;
  declare api: AxiosInstance;
  declare logger: any;

  constructor(config: any, session: string, logger?: any) {
    this.config = config;
    this.session = session;
    this.logger = logger;
    this.mobile_name = this.config.mobile_name
      ? this.config.mobile_name
      : `WPPConnect`;
    this.mobile_number = this.config.mobile_number
      ? this.config.mobile_number
      : '5511999999999';
    this.sender = {
      pushname: this.mobile_name,
      id: this.mobile_number,
    };
    this.account_id = this.config.account_id;
    this.inbox_id = this.config.inbox_id;
    this.api = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        api_access_token: this.config.token,
      },
    });

    // Log de inicialização do Chatwoot Client
    this.logInfo(`🔗 Chatwoot Client inicializado para sessão: ${session}`);
    this.logInfo(`📍 Base URL: ${this.config.baseURL}`);
    this.logInfo(`🏢 Account ID: ${this.account_id}`);
    this.logInfo(`📥 Inbox ID: ${this.inbox_id}`);
    this.logInfo(`📱 Mobile: ${this.mobile_name} (${this.mobile_number})`);

    // Testar conexão com Chatwoot
    this.testConnection();

    //assina o evento do qrcode
    eventEmitter.on(`qrcode-${session}`, (qrCode, urlCode, client) => {
      setTimeout(async () => {
        if (config?.chatwoot?.sendQrCode !== false) {
          this.sendMessage(client, {
            sender: this.sender,
            chatId: this.mobile_number + '@c.us',
            type: 'image',
            timestamp: 'qrcode',
            mimetype: 'image/png',
            caption: 'leia o qrCode',
            qrCode: qrCode.replace('data:image/png;base64,', ''),
          });
        }
      }, 1000);
    });

    //assiona o evento do status
    eventEmitter.on(`status-${session}`, (client, status) => {
      if (config?.chatwoot?.sendStatus !== false) {
        this.sendMessage(client, {
          sender: this.sender,
          chatId: this.mobile_number + '@c.us',
          body: `wppconnect status: ${status} `,
        });
      }
    });

    //assina o evento de mensagem
    eventEmitter.on(`mensagem-${session}`, (client, message) => {
      this.sendMessage(client, message);
    });
  }

  logInfo(message: string) {
    const logMessage = `[Chatwoot:${this.session}] ${message}`;
    if (this.logger) {
      this.logger.info(logMessage);
    } else {
      console.log(`ℹ️  ${logMessage}`);
    }
  }

  logError(message: string, error?: any) {
    const logMessage = `[Chatwoot:${this.session}] ${message}`;
    if (this.logger) {
      this.logger.error(logMessage, error);
    } else {
      console.error(`❌ ${logMessage}`, error || '');
    }
  }

  logSuccess(message: string) {
    const logMessage = `[Chatwoot:${this.session}] ${message}`;
    if (this.logger) {
      this.logger.info(logMessage);
    } else {
      console.log(`✅ ${logMessage}`);
    }
  }

  async testConnection() {
    try {
      this.logInfo('🔍 Testando conexão com Chatwoot...');
      
      // Tentar buscar informações da conta
      const { data } = await this.api.get(
        `api/v1/accounts/${this.account_id}`
      );
      
      this.logSuccess(`✓ Conexão estabelecida com sucesso!`);
      this.logSuccess(`✓ Conta: ${data.name || 'N/A'}`);
      this.logSuccess(`✓ Status: Online`);
      
      return true;
    } catch (error: any) {
      this.logError('✗ Falha ao conectar com Chatwoot');
      
      if (error.response) {
        // Erro de resposta do servidor
        this.logError(`✗ Status: ${error.response.status}`);
        this.logError(`✗ Mensagem: ${error.response.data?.message || error.response.statusText}`);
        
        if (error.response.status === 401) {
          this.logError('✗ Token de API inválido ou expirado');
        } else if (error.response.status === 404) {
          this.logError('✗ Account ID não encontrado');
        }
      } else if (error.request) {
        // Erro de rede/timeout
        this.logError('✗ Erro de conexão: Não foi possível alcançar o servidor Chatwoot');
        this.logError(`✗ Verifique se a URL está correta: ${this.config.baseURL}`);
      } else {
        this.logError('✗ Erro desconhecido', error.message);
      }
      
      return false;
    }
  }

  // async sendMessage(client: any, message: any) {
  //   if (message.isGroupMsg || message.chatId.indexOf('@broadcast') > 0) return;
  //   const contact = await this.createContact(message);
  //   const conversation = await this.createConversation(
  //     contact,
  //     message.chatId.split('@')[0]
  //   );

  //   try {
  //     if (
  //       message.type == 'image' ||
  //       message.type == 'video' ||
  //       message.type == 'in' ||
  //       message.type == 'document' ||
  //       message.type == 'ptt' ||
  //       message.type == 'audio' ||
  //       message.type == 'sticker'
  //     ) {
  //       if (message.mimetype == 'image/webp') message.mimetype = 'image/jpeg';
  //       const extension = mime.extension(message.mimetype);
  //       const filename = `${message.timestamp}.${extension}`;
  //       let b64;

  //       if (message.qrCode) b64 = message.qrCode;
  //       else {
  //         const buffer = await client.decryptFile(message);
  //         b64 = await buffer.toString('base64');
  //       }

  //       const mediaData = Buffer.from(b64, 'base64');

  //       // Create a readable stream from the Buffer
  //       const stream = new Readable();
  //       stream.push(mediaData);
  //       stream.push(null); // Signaling the end of the stream

  //       const data = new FormData();
  //       if (message.caption) {
  //         data.append('content', message.caption);
  //       }

  //       data.append('attachments[]', stream, {
  //         filename: filename,
  //         contentType: message.mimetype,
  //       });

  //       data.append('message_type', 'incoming');
  //       data.append('private', 'false');

  //       const configPost = Object.assign(
  //         {},
  //         {
  //           baseURL: this.config.baseURL,
  //           headers: {
  //             'Content-Type': 'application/json;charset=utf-8',
  //             api_access_token: this.config.token,
  //           },
  //         }
  //       );

  //       configPost.headers = { ...configPost.headers, ...data.getHeaders() };
  //       console.log('PRÉ-REQUEST');
  //       const result = await axios.post(
  //         `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`,
  //         data,
  //         configPost
  //       );
  //       console.log('POS-REQUEST');
  //       return result;
  //     } else {
  //       const body = {
  //         content: message.body,
  //         message_type: 'incoming',
  //       };
  //       const { data } = await this.api.post(
  //         `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`,
  //         body
  //       );
  //       return data;
  //     }
  //   } catch (e) {
  //     return null;
  //   }
  // }

  async sendMessage(client: any, message: any) {
    if (message.isGroupMsg || message.chatId.indexOf('@broadcast') > 0) return;

    const contact = await this.createContact(message);
    if (!contact) {
      this.logError('✗ Falha ao criar/buscar contato no Chatwoot');
      return null;
    }

    const conversation = await this.createConversation(
      contact,
      message.chatId.split('@')[0]
    );
    if (!conversation) {
      this.logError('✗ Falha ao criar/buscar conversação no Chatwoot');
      return null;
    }

    try {
      if (
        [
          'image',
          'video',
          'in',
          'document',
          'ptt',
          'audio',
          'sticker',
        ].includes(message.type)
      ) {
        if (message.mimetype === 'image/webp') message.mimetype = 'image/jpeg';
        const extension = mime.extension(message.mimetype);
        const filename = `${message.timestamp}.${extension}`;
        let b64;

        if (message.qrCode) {
          b64 = message.qrCode;
        } else {
          const buffer = await client.decryptFile(message);
          b64 = buffer.toString('base64');
        }

        const mediaData = Buffer.from(b64, 'base64');
        const stream = bufferutils.bufferToReadableStream(mediaData);

        const data = new FormData();
        if (message.caption) {
          data.append('content', message.caption);
        }

        data.append('attachments[]', stream, {
          filename: filename,
          contentType: message.mimetype,
        });

        data.append('message_type', 'incoming');
        data.append('private', 'false');

        const configPost: AxiosRequestConfig = {
          baseURL: this.config.baseURL,
          headers: {
            api_access_token: this.config.token,
            ...data.getHeaders(),
          },
        };
        const endpoint = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`;

        const result = await axios.post(endpoint, data, configPost);
        
        this.logSuccess(`✓ Mídia enviada para Chatwoot (${message.type}): ${filename}`);
        return result;
      } else {
        const body = {
          content: message.body,
          message_type: 'incoming',
        };
        const endpoint = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`;

        const { data } = await this.api.post(endpoint, body);
        
        this.logSuccess(`✓ Mensagem enviada para Chatwoot`);
        return data;
      }
    } catch (e: any) {
      this.logError('✗ Erro ao enviar mensagem para Chatwoot', e);
      if (e.response) {
        this.logError(`✗ Status: ${e.response.status}`, e.response.data);
      }
      return null;
    }
  }

  async findContact(query: string) {
    try {
      const { data } = await this.api.get(
        `api/v1/accounts/${this.account_id}/contacts/search/?q=${query}`
      );
      return data;
    } catch (e: any) {
      this.logError(`✗ Erro ao buscar contato: ${query}`, e.message);
      return null;
    }
  }

  async createContact(message: any) {
    const body = {
      inbox_id: this.inbox_id,
      name: message.sender.isMyContact
        ? message.sender.formattedName
        : message.sender.pushname || message.sender.formattedName,
      phone_number:
        typeof message.sender.id == 'object'
          ? message.sender.id.user
          : message.sender.id.split('@')[0],
    };
    body.phone_number = `+${body.phone_number}`;
    
    const contact = await this.findContact(body.phone_number.replace('+', ''));
    if (contact && contact.meta.count > 0) {
      this.logInfo(`✓ Contato encontrado: ${body.name} (${body.phone_number})`);
      return contact.payload[0];
    }

    try {
      this.logInfo(`📝 Criando novo contato: ${body.name} (${body.phone_number})`);
      const data = await this.api.post(
        `api/v1/accounts/${this.account_id}/contacts`,
        body
      );
      this.logSuccess(`✓ Contato criado com sucesso: ${body.name}`);
      return data.data.payload.contact;
    } catch (e: any) {
      this.logError(`✗ Erro ao criar contato: ${body.name}`, e.response?.data || e.message);
      return null;
    }
  }

  async findConversation(contact: any) {
    try {
      const { data } = await this.api.get(
        `api/v1/accounts/${this.account_id}/contacts/${contact.id}/conversations`
      );
      return data.payload.find(
        (e: any) => e.inbox_id == this.inbox_id && e.status != 'resolved'
      );
    } catch (e: any) {
      this.logError(`✗ Erro ao buscar conversação do contato ${contact.id}`, e.message);
      return null;
    }
  }

  async createConversation(contact: any, source_id: any) {
    const conversation = await this.findConversation(contact);
    if (conversation) {
      this.logInfo(`✓ Conversação existente encontrada: ID ${conversation.id}`);
      return conversation;
    }

    const body = {
      source_id: source_id,
      inbox_id: this.inbox_id,
      contact_id: contact.id,
      status: 'open',
    };

    try {
      this.logInfo(`📝 Criando nova conversação para contato ${contact.name}`);
      const { data } = await this.api.post(
        `api/v1/accounts/${this.account_id}/conversations`,
        body
      );
      this.logSuccess(`✓ Conversação criada com sucesso: ID ${data.id}`);
      return data;
    } catch (e: any) {
      this.logError(`✗ Erro ao criar conversação`, e.response?.data || e.message);
      return null;
    }
  }
}
