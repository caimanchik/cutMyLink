from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from cutMyLink.settings import host
from .serializers import LinkSerializer


class CreateLink(APIView):

    @staticmethod
    def post(request):
        serializer = LinkSerializer(data=request.data.get('data'), partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                link = serializer.create(data=serializer.validated_data)
                return Response(link, status=status.HTTP_201_CREATED)
        except serializers.ValidationError:
            return Response(
                {"message": '; '.join(str(x) for x in serializer.errors['non_field_errors'])},
                status=status.HTTP_400_BAD_REQUEST)


class GetLink(APIView):

    @staticmethod
    def get(request):
        if request.query_params.get('link')[:len(host)] != host:
            return Response({"message": 'Такой ссылки не существует'}, status=status.HTTP_404_NOT_FOUND)
        serializer = LinkSerializer(data={'short_link': request.query_params.get('link')[len(host):]}, partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                try:
                    link = serializer.get(
                        request.query_params.get('link', host)[len(host):],
                        bool(int(request.query_params.get('redirect', 0))))
                except KeyError as e:
                    return Response({"message": ', '.join(e.args)}, status=status.HTTP_404_NOT_FOUND)

                return Response(link, status=status.HTTP_200_OK)
        except serializers.ValidationError:
            return Response(
                {"message": '; '.join(str(x) for x in serializer.errors['non_field_errors'])},
                status=status.HTTP_400_BAD_REQUEST)