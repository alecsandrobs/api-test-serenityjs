import { Ensure, equals, isGreaterThan } from '@serenity-js/assertions';
import { actorCalled, actorInTheSpotlight, AnswersQuestions, Loop, Note, PerformsActivities, Question, TakeNote, Task } from '@serenity-js/core';
import { DeleteRequest, GetRequest, LastResponse, PostRequest, PutRequest, Send } from '@serenity-js/rest';
import 'mocha';
import { hasCreatedStatus, hasNoContentStatus, hasSuccessfullStatus, wasABadRequestStatus, wasNotfoundStatus } from '../support/matchers/httpStatusMatchers';
import { returnsCorrectSchema } from '../support/matchers/schemaMatchers';
import { errorNotFoundResponseSchema, errorResponseSchema } from '../support/schema/error';
import { pessoaResponseSchema, pessoasResponseSchema } from '../support/schema/pessoa';


describe('People', () => {

    before('Clean database', () =>
        actorCalled('Michele').attemptsTo(
            Send.a(GetRequest.to('/pessoas')))
        .then(() =>
            actorInTheSpotlight().answer(LastResponse.body()).then(response =>
                actorInTheSpotlight().attemptsTo(
                    Loop.over(response).to(
                        DeletePerson.withData(Loop.item<any>())
                    )
                )
            )
        )
    )
    
    describe('POST /pessoas', () => {
        it('should return 201 and the person schema', () => 
            actorInTheSpotlight().attemptsTo(
                Send.a(PostRequest.to('/pessoas').with(
                    {
                        nome: 'Pessoa Criada pelo SerenityJS',
                        telefone: '+55 (48) 98765-4321',
                        email: 'pessoa.serenity@email.com',
                    }
                )),
                Ensure.that(LastResponse.status(), hasCreatedStatus),
                Ensure.that(LastResponse.body(), returnsCorrectSchema(pessoaResponseSchema))
            )
        )
        
        return it('should return 400 and the error schema', () => 
            actorInTheSpotlight().attemptsTo(
                Send.a(PostRequest.to('/pessoas').with(
                    {
                        telefone: '+55 (48) 98765-4321',
                        email: 'pessoa.codecept@email.com',
                    }
                )),
                Ensure.that(LastResponse.status(), wasABadRequestStatus),
                Ensure.that(LastResponse.body(), returnsCorrectSchema(errorResponseSchema))
            )    
        )
    })

    describe('GET /pessoas', () => {
        it('should return 200 and all people', () =>
            actorInTheSpotlight().attemptsTo(
                Send.a(GetRequest.to('/pessoas')),
                Ensure.that(LastResponse.status(), hasSuccessfullStatus),
                Ensure.that(LastResponse.body(), returnsCorrectSchema(pessoasResponseSchema)))
            .then(() =>
                actorInTheSpotlight().answer(LastResponse.body()).then((response:any) =>
                    actorInTheSpotlight().attemptsTo(
                        Ensure.that(response.length, isGreaterThan(0) as any),
                        TakeNote.of(response[0]).as('person')
                    )
                )
            )
        )

        it('should return 200 and only one person', () =>
            actorInTheSpotlight().answer(Note.of('person')).then((person:any) =>
                actorInTheSpotlight().attemptsTo(
                    Send.a(GetRequest.to(`/pessoas/${person._id}`)),
                    Ensure.that(LastResponse.status(), hasSuccessfullStatus),
                    Ensure.that(LastResponse.body(), returnsCorrectSchema(pessoaResponseSchema))
                )
            )
        )
        
        it('should return 404 and only one person', () =>
            actorInTheSpotlight().attemptsTo(
                Send.a(GetRequest.to('/pessoas/987654321')),
                Ensure.that(LastResponse.status(), wasNotfoundStatus),
                Ensure.that(LastResponse.body(), returnsCorrectSchema(errorNotFoundResponseSchema))
            )
        )
    })
    
    describe('PUT /pessoas', () => {
        it('should return 200 and the person schema', () => 
            actorInTheSpotlight().answer(Note.of('person')).then((person:any) =>
                actorInTheSpotlight().attemptsTo(
                    Send.a(PutRequest.to(`/pessoas/${person._id}`).with(
                        {
                            nome: 'Pessoa Editada pelo SerenityJS',
                            telefone: '+55 (48) 12345-6789',
                            email: 'pessoa.serenity@email.com',
                        }
                    )),
                    Ensure.that(LastResponse.status(), hasSuccessfullStatus),
                    Ensure.that(LastResponse.body(), returnsCorrectSchema(pessoaResponseSchema))
                )
            )    
        )

        it('should return 400 and the error schema', () => 
            actorInTheSpotlight().answer(Note.of('person')).then((person:any) =>
                actorInTheSpotlight().attemptsTo(
                    Send.a(PutRequest.to(`/pessoas/${person._id}`).with(
                        {
                            nome: '',
                            telefone: '+55 (48) 12345-6789',
                            email: 'pessoa.serenity@email.com',
                        }
                    )),
                    Ensure.that(LastResponse.status(), wasABadRequestStatus),
                    Ensure.that(LastResponse.body(), returnsCorrectSchema(errorResponseSchema))
                )
            )
        )
        
        it('should return 404 and the error schema', () => 
            actorInTheSpotlight().attemptsTo(
                Send.a(PutRequest.to('/pessoas/777').with(
                    {
                        nome: 'Pessoa Editada pelo SerenityJS (ERRO)',
                        telefone: '+55 (48) 12345-6789',
                        email: 'pessoa.serenity@email.com',
                    }
                )),
                Ensure.that(LastResponse.status(), wasNotfoundStatus),
                Ensure.that(LastResponse.body(), returnsCorrectSchema(errorNotFoundResponseSchema))
            )
        )
    })

    describe('PUT /pessoas', () => {
        it('should return 204', () => 
            actorInTheSpotlight().answer(Note.of('person')).then((person:any) =>
                actorInTheSpotlight().attemptsTo(
                    Send.a(DeleteRequest.to(`/pessoas/${person._id}`)),
                    Ensure.that(LastResponse.status(), hasNoContentStatus),
                    Ensure.that(LastResponse.body(), equals('' as any))
                )
            )    
        )

        it('should return 400 and the error schema', () => 
            actorInTheSpotlight().attemptsTo(
                Send.a(DeleteRequest.to(`/pessoas/1234567`)),
                Ensure.that(LastResponse.status(), wasNotfoundStatus),
                Ensure.that(LastResponse.body(), returnsCorrectSchema(errorNotFoundResponseSchema))
            )
        )
    })
})

class DeletePerson implements Task {

    constructor(private data: Question<any>) { }
    
    static withData(data: Question<any>){
        return new DeletePerson(data)
    }
    
    performAs(actor: AnswersQuestions & PerformsActivities): PromiseLike<void> {
        return actor.answer(this.data).then(data =>
            actor.attemptsTo(Send.a(DeleteRequest.to(`/pessoas/${data._id}`)))
        )
    }
}