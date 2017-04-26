import * as nock from 'nock';
import HttpStatus from 'http-status-enum';

export const corsHeaders: nock.HttpHeaders = { 'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, authorization' };

export const jsonContentType: nock.HttpHeaders = { 'Content-Type': 'application/json' };

export const nockTestApi = (url) => {
    return nock(url).defaultReplyHeaders({ ...corsHeaders, ...jsonContentType });
};

export const nockCorsOptions = (url) => {
    return nockTestApi(url)
        .options(/.*/)
        .reply(HttpStatus.OK, undefined);
};

export const beforeEachFunction = (url) => {
    nockCorsOptions(url);
};
